---
title: API Design Specification
description: API Design Specification
---

## API Design Specification

This document describes how to use definitions from the `swagger` directory on Service, messages, and fields to supplement gRPC-style interfaces for HTTP access and generate corresponding OpenAPI/Swagger information.

### 1. Use Cases and Dependencies
- Map `service` to HTTP path space and manage them in groups.
- Supplement each `rpc` with HTTP verb, path, description, permissions, and other metadata.
- Supplement request/response messages and fields with JSONSchema constraints and examples.

Main dependencies:
- `apihug/protobuf/swagger/swagger.proto`
- `apihug/protobuf/swagger/annotations.proto`
- `apihug/protobuf/mock/mock.proto` (when mock data is needed)

### 2. Service-Level Configuration: ServiceSchema ((hope.swagger.svc))

Add service-level options on publicly exposed `service`:

```proto
import "apihug/protobuf/swagger/annotations.proto";

service PetService {
  option (hope.swagger.svc) = {
    path: "/pet";
    description: "Pet Manager service";
  };
}
```

- `path`: Base path of the service, typically using resource name or its plural form, such as `/user`, `/orders`.
- `description`: Brief description of the service, can use Chinese.

### 3. RPC-Level Configuration: Operation ((hope.swagger.operation))

#### 3.1 HTTP Verb and Path

Configure HTTP mapping on each external API's `rpc`:

```proto
rpc AddPersonalProject (RequestType) returns (ResponseType) {
  option (hope.swagger.operation) = {
    post: "/upload-meta";
    description: "开放平台上传API元数据";
    tags: "open";
  };
}
```

- Common verb choices:
  - Query: `get`.
  - Create: `post`.
  - Full update: `put`.
  - Partial update: `patch`.
  - Delete: `delete`.
- Variables in path are enclosed in `{}`, e.g., `"/pet/{id}"`.

#### 3.2 List and Pagination

- `pageable = true`: Indicates the operation is a paginated query; the framework will wrap request parameters and return structure for pagination.
- `input_repeated` / `out_repeated`: Indicates request body or response body is a list structure (non-paginated).

#### 3.3 Media Type and Request Name

- `request_name`: Give the request body a logical name for generators or documentation, optional.
- `response_media_type`: Select response media type from `Operation.MediaType`, common values include:
  - `APPLICATION_JSON`
  - `TEXT_PLAIN`
  - `APPLICATION_PDF`, etc.

### 4. Message-Level Schema: ((hope.swagger.schema) + JSONSchema)

#### 4.1 Add Schema to Request/Response Messages

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

- `title`: Object name, optional, recommended to set on core objects.
- `description`: Object purpose description, recommended to be a clear natural language description.

#### 4.2 Field-Level JSONSchema: ((hope.swagger.field))

Use field-level extension on externally visible fields:

```proto
string name = 1 [(hope.swagger.field) = {
  description: "名称";
  example: "物流助手";
  empty: FALSE;
}];
```

- `description`: Field meaning description.
- `example`: Example value, used for documentation and frontend integration.
- Empty value and required control (choose one from JSONSchema's oneof):
  - `empty`: Control whether empty or empty collection is allowed.
  - `blank`: For strings only, control whether blank strings are allowed.
  - `nullable`: Control whether `null` is allowed (mostly for non-string types).

#### 4.3 Common Constraints and Format Fields

The following common constraints can be combined in JSONSchema:

- Length-related:
  - `max_length` / `min_length`: String length range.
  - `max_items` / `min_items`: Number of elements in collection range.
- Numeric-related:
  - `maximum` / `minimum` (with `exclusive_maximum` / `exclusive_minimum`).
- Pattern matching:
  - `pattern`: Use regular expression to constrain string format.
- Enum values:
  - `enum`: List of allowed values (in string form).
- Date and time:
  - `time_constraint_type`: Specify time constraint type, such as `FUTURE`, `PAST`, etc.
  - `date_format`: Use predefined `DateFormat`, such as `YYYY_MM_DD_HH_MM_SS`.
  - Or `customized_date_format`: Use custom format string.
- Email:
  - `email`: Mark strings that need to conform to email format.

#### 4.4 Field-Level mock

If you need to generate test data for a field, you can use the `mock` field in the field's JSONSchema and configure it in combination with `mock` command rules.

### 5. Parameter Objects: Parameters / Parameter

For path, query, header, Cookie, Session, and other parameters, you can explicitly define them through `Operation.parameters`:

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

- `name`: Parameter name, consistent with path or query parameter name.
- `in`: Parameter location: `QUERY`, `HEADER`, `PATH`, `COOKIE`, `SESSION`.
- `schema`: Use JSONSchema to describe the type and constraints of this parameter.
- `plural`: Use `BoolType` to indicate whether this parameter is in array form.

### 6. Permissions and Grouping: Authorization / RBAC / Group

1. Basic access control
   - Use `authorization.low_limit_risky_mode`:
     - `ANONYMOUS`: Accessible without login.
     - `LOGIN`: Requires logged-in user.
     - `ACTIVE`: Requires login and account in active state.

2. Role and permission combination control
   - Use `authorization.rbac`:
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
   - `roles.roles`: Role list.
   - `authorities`: Permission identifier list, needs to match with the Authority enum in business.
   - `combinator`: Combination method of roles and permissions (such as AND).

3. API grouping
   - Use `group` to mark the frontend scenario to which the interface belongs:
     - `CUSTOMER`: For end users.
     - `TENANT`: For tenant management backend.
     - `PLATFORM`: For platform operation backend.

### 7. Natural Language Prompts and Visibility for LLM

1. Natural language questions: `questions`
   ```proto
   option (hope.swagger.operation) = {
     get: "/orders";
     questions: [
       "如何获取当前用户的订单列表?",
       "查询最近一页订单数据"
     ];
   };
   ```
   - `questions` can be filled with several natural language questions to help large language models understand the interface purpose and invocation method.

2. Visibility control: `internal` and `hide`
   - `internal = true`: Interface is for internal use only, not for frontend or external callers.
   - `hide = true`: Hide this interface when generating documentation (e.g., debugging or operational interfaces).

### 8. Response Customization

In `Operation`, you can refine the return structure through response-related fields:

- `body_empty`: Allow the interface to return empty body, suitable for pure command-style operations.
- `mock`: Define mock data for simple type responses.
- `response_schema`: Directly provide JSONSchema description of response body, used to override default inference in special scenarios.

### 9. Usage Recommendations

1. Supplement each external `service` and `rpc` with necessary path, description, and grouping information to make API documentation clear and readable.
2. Configure `(hope.swagger.schema)` for key request/response messages and configure description, examples, and constraints in `(hope.swagger.field)` for fields.
3. When you need to automatically generate test data, configure it through the `mock` field of the field or Operation in combination with `mock` directory rules.
4. For interfaces with permission requirements, clearly express access boundaries through `authorization` and `group`.
