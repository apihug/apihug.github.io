---
title: 枚举类型规范
description: proto 枚举类型生成
---

## 枚举与错误元数据设计规范

本说明描述在枚举上如何使用 `extend/constant.proto` 中的扩展字段，为每个枚举值附加业务编码、多语言文案以及错误相关信息。

### 1. 使用场景
- 为业务枚举值配置稳定的业务编码（code）。
- 为枚举值补充多语言文案说明。
- 为错误相关枚举值补充 HTTP 状态码、错误严重程度、所属层次等元数据。

主要依赖：
- `apihug/protobuf/extend/constant.proto`
- 扩展点：`extend google.protobuf.EnumValueOptions { Meta field = 37020; }`

### 2. 基本用法

1. 定义普通业务枚举时，为每个枚举值添加 `Meta` 信息：
   ```proto
   syntax = "proto3";
   package your.package;

   import "apihug/protobuf/extend/constant.proto";

   enum OrderStatus {
     UNKNOWN = 0 [(hope.constant.field) = {
       code: 0;
       message: "unknown";
       message2: "未知";
     }];

     CREATED = 1 [(hope.constant.field) = {
       code: 1;
       message: "created";
       message2: "已创建";
     }];
   }
   ```
2. 扩展挂在“枚举值”上，而不是枚举本身或其它消息。

### 3. Meta 字段说明

`Meta` 用于描述枚举值的通用信息：

- `code` (int32)
  - 枚举值的业务编码。
  - 在同一个枚举类型内应保持唯一且稳定，通常从 1 开始。
- `message` (string)
  - 主语言文案，例如英文或约定的主语种。
  - 适合直接用于日志、界面文案或 API 返回。
- `message2` (string)
  - 第二语言文案，例如中文。
  - 若业务暂不需要多语言，可省略。
- `error` (`Error`)
  - 当该枚举值用作错误码时，用于补充错误相关的元数据（见下一节）。

如果不配置 `Meta`，框架可以按默认规则推断，但为了可读性和稳定性，推荐为新代码显式设置。

### 4. 错误相关扩展：Error

当枚举用于错误码（例如业务错误、系统错误）时，可在 `Meta.error` 中描述错误信息：

```proto
enum UserError {
  USER_NOT_FOUND = 1 [(hope.constant.field) = {
    code: 10001;
    message: "user_not_found";
    message2: "用户不存在";
    error: {
      title: "User not found";
      tips: "检查用户ID是否正确，或联系管理员";
      http_status: NOT_FOUND;
      phase: SERVICE;
      severity: ERROR;
    };
  }];
}
```

- `title` (string)
  - 错误标题，简洁描述问题类型。
- `tips` (string)
  - 处理该错误时可以给出的提示信息，可使用中文自然语言。
- `http_status` (`HttpStatus` 枚举)
  - 对应的 HTTP 状态码，例如 `BAD_REQUEST`、`UNAUTHORIZED`、`NOT_FOUND`、`INTERNAL_SERVER_ERROR` 等。
- `phase` (`Phase` 枚举)
  - 错误主要出现的层次：
    - `CONTROLLER`：接口/表示层。
    - `SERVICE`：服务/应用层。
    - `DOMAIN`：领域模型层。
- `severity` (`Severity` 枚举)
  - 错误严重程度：
    - `LOW`：低影响。
    - `WARN`：警告，可重试。
    - `ERROR`：正常业务无法继续。
    - `FATAL`：严重错误，可能破坏数据或需要人工介入。

### 5. HttpStatus 使用建议

- 为表示客户端输入问题的错误选择 4xx 状态码，例如：
  - 参数不合法：`BAD_REQUEST` (400)。
  - 未登录或权限不足：`UNAUTHORIZED` (401) 或 `FORBIDDEN` (403)。
  - 资源不存在：`NOT_FOUND` (404)。
- 为表示服务端处理问题的错误选择 5xx 状态码，例如：
  - 一般服务内部错误：`INTERNAL_SERVER_ERROR` (500)。

### 6. 建模建议

1. 为每个枚举值分配清晰、稳定的 `code`，避免随意复用或修改已有编码。
2. 为需要呈现给用户或外部系统的枚举值，补充合适的 `message` / `message2` 文案。
3. 对作为错误码使用的枚举值，完整设置 `error` 字段，方便统一处理和排查问题。
4. 在选择 `HttpStatus` 时，以标准 HTTP 语义为基础，避免过度使用 200/500 作为通用状态。
