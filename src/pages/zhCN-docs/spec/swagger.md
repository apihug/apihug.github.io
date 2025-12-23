---
title: Swagger 指令规范
description: Swagger Proto生成
---

## API 设计规范

本说明描述如何在 Service、消息和字段上使用 `swagger` 目录下的定义，将 gRPC 风格的接口补充为可通过 HTTP 访问的 API，并生成相应的
OpenAPI/Swagger 信息。

### 1. 使用场景与依赖

- 将 `service` 映射到 HTTP 路径空间，并分组管理。
- 为每个 `rpc` 补充 HTTP 动词、路径、说明、权限等元数据。
- 为请求/响应消息和字段补充 JSONSchema 约束与示例。

主要依赖：

- `apihug/protobuf/swagger/swagger.proto`
- `apihug/protobuf/swagger/annotations.proto`
- `apihug/protobuf/mock/mock.proto`（在需要 mock 数据时）

### 2. Service 级配置：ServiceSchema（(hope.swagger.svc)）

在对外暴露的 `service` 上添加服务级选项：

```proto
import "apihug/protobuf/swagger/annotations.proto";

service PetService {
  option (hope.swagger.svc) = {
    path: "/pet";
    description: "Pet Manager service";
  };
}
```

- `path`：服务的基础路径，一般使用资源名或其复数形式，如 `/user`、`/orders`。
- `description`：对该服务的简要说明，可使用中文。

### 3. RPC 级配置：Operation（(hope.swagger.operation)）

#### 3.1 HTTP 动词与路径

在每个外部 API 的 `rpc` 上配置 HTTP 映射：

```proto
rpc AddPersonalProject (RequestType) returns (ResponseType) {
  option (hope.swagger.operation) = {
    post: "/upload-meta";
    description: "开放平台上传API元数据";
    tags: "open";
  };
}
```

- 常用动词选择：
  - 查询：`get`。
  - 创建：`post`。
  - 全量更新：`put`。
  - 部分更新：`patch`。
  - 删除：`delete`。
- 路径中的变量使用 `{}` 包裹，例如 `"/pet/{id}"`。

#### 3.2 列表与分页

- `pageable = true`：表示该操作为分页查询，框架会对请求参数和返回结构进行分页包装。
- `input_repeated` / `out_repeated`：表示请求体或响应体为列表结构（非分页）。

#### 3.3 媒体类型与请求名

- `request_name`：给请求体一个逻辑名称，用于生成器或文档，可选。
- `response_media_type`：从 `Operation.MediaType` 中选择响应媒体类型，常用值包括：
  - `APPLICATION_JSON`
  - `TEXT_PLAIN`
  - `APPLICATION_PDF` 等

### 4. 消息级 Schema：（(hope.swagger.schema) + JSONSchema）

#### 4.1 为请求/响应消息添加 Schema

```proto
import "apihug/protobuf/swagger/annotations.proto";

message PlaceOrderRequest {
  option (hope.swagger.schema) = {
    json_schema: {
      title: "PlaceOrder";
      description: "下单请求";
    };
  };
}
```

- `title`：对象名称，可选，建议在核心对象上设置。
- `description`：对象用途说明，建议设置为清晰的自然语言描述。

#### 4.2 字段级 JSONSchema：（(hope.swagger.field)）

在对外可见的字段上使用字段级扩展：

```proto
string name = 1 [(hope.swagger.field) = {
  description: "名称";
  example: "物流助手";
  empty: FALSE;
}];
```

- `description`：字段含义说明。
- `example`：示例值，用于文档和前端联调。
- 空值与必填控制（从 `JSONSchema` 的 oneof 中选择一种）：
  - `empty`：控制是否允许为空或空集合。
  - `blank`：仅对字符串，控制是否允许空白串。
  - `nullable`：控制是否允许为 `null`（多用于非字符串类型）。

#### 4.3 常见约束与格式字段

可在 JSONSchema 中组合使用以下常用约束：

- 长度相关：
  - `max_length` / `min_length`：字符串长度范围。
  - `max_items` / `min_items`：集合中元素个数范围。
- 数值相关：
  - `maximum` / `minimum`（配合 `exclusive_maximum` / `exclusive_minimum`）。
- 模式匹配：
  - `pattern`：使用正则表达式约束字符串格式。
- 枚举值：
  - `enum`：允许值列表（字符串形式）。
- 日期和时间：
  - `time_constraint_type`：指定时间约束类型，如 `FUTURE`、`PAST` 等。
  - `date_format`：使用预定义的 `DateFormat`，如 `YYYY_MM_DD_HH_MM_SS`。
  - 或 `customized_date_format`：使用自定义格式字符串。
- 邮箱：
  - `email`：标记需要符合邮箱格式的字符串。

#### 4.4 字段级 mock

如需为字段生成测试数据，可在字段的 JSONSchema 中使用 `mock` 字段，并结合 `mock` 命令规则进行配置。

### 5. 参数对象：Parameters / Parameter

对于路径、查询、头部、Cookie、Session 等参数，可以通过 `Operation.parameters` 显式定义：

```proto
option (hope.swagger.operation) = {
  get: "/pet/{id}";
  parameters: {
    parameter: [{
      name: "id";
      in: PATH;
      schema: {
        format: INTEGER;
        minimum: 1;
      };
    }];
  };
};
```

- `name`：参数名称，与路径或查询参数名一致。
- `in`：参数位置：`QUERY`、`HEADER`、`PATH`、`COOKIE`、`SESSION`。
- `schema`：使用 JSONSchema 描述该参数的类型和约束。
- `plural`：使用 `BoolType` 指示该参数是否为数组形式。

### 6. 权限与分组：Authorization / RBAC / Group

1. 基础访问控制
  - 使用 `authorization.low_limit_risky_mode`：
    - `ANONYMOUS`：无需登录即可访问。
    - `LOGIN`：需登录用户。
    - `ACTIVE`：需登录且账号处于有效状态。

2. 角色与权限组合控制
  - 使用 `authorization.rbac`：
   ```proto
   option (hope.swagger.operation) = {
     post: "/admin/user";
     authorization: {
       rbac: {
         roles: { roles: ["ROLE_ADMIN"]; };
         authorities: ["USER_ADD", "USER_DELETE"];
         combinator: AND;
       };
     };
   };
   ```
  - `roles.roles`：角色列表。
  - `authorities`：权限标识列表，需要能与业务中的 Authority 枚举对上。
  - `combinator`：角色与权限的组合方式（如 AND）。

3. API 分组
  - 使用 `group` 标记接口所属的前端场景：
    - `CUSTOMER`：面向终端用户。
    - `TENANT`：面向租户管理后台。
    - `PLATFORM`：面向平台运营后台。

### 7. 面向 LLM 的自然语言提示与可见性

1. 自然语言问题：`questions`
   ```proto
   option (hope.swagger.operation) = {
     get: "/orders";
     questions: [
       "如何获取当前用户的订单列表？",
       "查询最近一页订单数据"
     ];
   };
   ```
  - `questions` 可填写若干自然语言问题，帮助大模型理解接口用途与调用方式。

2. 可见性控制：`internal` 与 `hide`
  - `internal = true`：接口仅供内部使用，不面向前端或外部调用方。
  - `hide = true`：在生成文档时隐藏该接口（如调试或运维接口）。

### 8. 响应定制

在 `Operation` 中，可以通过响应相关字段对返回结构进行细化：

- `body_empty`：允许接口返回空 body，适用于纯命令式操作。
- `mock`：为简单类型响应定义 mock 数据。
- `response_schema`：直接提供响应体的 JSONSchema 描述，用于特殊场景下覆盖默认推断。

### 9. 使用建议

1. 为每个对外的 `service` 和 `rpc` 补充必要的路径、说明和分组信息，使 API 文档清晰可读。
2. 为关键请求/响应消息配置 `(hope.swagger.schema)`，并为字段配置 `(hope.swagger.field)` 中的描述、示例和约束。
3. 在需要自动生成测试数据时，通过字段或 Operation 的 `mock` 字段结合 `mock` 目录规则进行配置。
4. 对有权限要求的接口，优先通过 `authorization` 和 `group` 清晰表达访问边界。
