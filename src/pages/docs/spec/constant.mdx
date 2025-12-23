---
title: Enum and Error Metadata Design Specification
description: Enum and Error Metadata Design Specification
---

## Enum and Error Metadata Design Specification

This document describes how to use extension fields from `extend/constant.proto` on enums to attach business codes, multilingual messages, and error-related information to each enum value.

### 1. Use Cases
- Configure stable business codes for business enum values.
- Add multilingual message descriptions for enum values.
- Supplement error-related enum values with HTTP status codes, error severity, layer information, and other metadata.

Main dependencies:
- `apihug/protobuf/extend/constant.proto`
- Extension point: `extend google.protobuf.EnumValueOptions { Meta field = 37020; }`

### 2. Basic Usage

1. When defining regular business enums, add `Meta` information to each enum value:
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
2. Extensions are attached to "enum values", not to the enum itself or other messages.

### 3. Meta Field Description

`Meta` is used to describe general information about enum values:

- `code` (int32)
  - Business code for the enum value.
  - Should remain unique and stable within the same enum type, typically starting from 1.
- `message` (string)
  - Primary language message, e.g., English or the agreed-upon primary language.
  - Suitable for direct use in logs, UI text, or API responses.
- `message2` (string)
  - Secondary language message, e.g., Chinese.
  - Can be omitted if multilingual support is not currently needed.
- `error` (`Error`)
  - Used to supplement error-related metadata when the enum value serves as an error code (see next section).

If `Meta` is not configured, the framework can infer default rules, but for readability and stability, it is recommended to explicitly set it for new code.

### 4. Error-Related Extension: Error

When an enum is used for error codes (e.g., business errors, system errors), error information can be described in `Meta.error`:

```proto
enum UserError {
  USER_NOT_FOUND = 1 [(hope.constant.field) = {
    code: 10001;
    message: "user_not_found";
    message2: "用户不存在";
    error: {
      title: "User not found";
      tips: "检查用户ID是否正确,或联系管理员";
      http_status: NOT_FOUND;
      phase: SERVICE;
      severity: ERROR;
    };
  }];
}
```

- `title` (string)
  - Error title, concisely describing the problem type.
- `tips` (string)
  - Helpful information that can be provided when handling this error, can use natural language in Chinese.
- `http_status` (`HttpStatus` enum)
  - Corresponding HTTP status code, e.g., `BAD_REQUEST`, `UNAUTHORIZED`, `NOT_FOUND`, `INTERNAL_SERVER_ERROR`, etc.
- `phase` (`Phase` enum)
  - Layer where the error primarily occurs:
    - `CONTROLLER`: Interface/presentation layer.
    - `SERVICE`: Service/application layer.
    - `DOMAIN`: Domain model layer.
- `severity` (`Severity` enum)
  - Error severity level:
    - `LOW`: Low impact.
    - `WARN`: Warning, retryable.
    - `ERROR`: Normal business flow cannot continue.
    - `FATAL`: Critical error, may corrupt data or require manual intervention.

### 5. HttpStatus Usage Recommendations

- For errors representing client input issues, choose 4xx status codes, for example:
  - Invalid parameters: `BAD_REQUEST` (400).
  - Not logged in or insufficient permissions: `UNAUTHORIZED` (401) or `FORBIDDEN` (403).
  - Resource not found: `NOT_FOUND` (404).
- For errors representing server-side processing issues, choose 5xx status codes, for example:
  - General internal server errors: `INTERNAL_SERVER_ERROR` (500).

### 6. Modeling Recommendations

1. Assign clear, stable `code` values to each enum value, avoiding arbitrary reuse or modification of existing codes.
2. For enum values that need to be presented to users or external systems, supplement with appropriate `message` / `message2` text.
3. For enum values used as error codes, fully configure the `error` field to facilitate unified handling and troubleshooting.
4. When choosing `HttpStatus`, base it on standard HTTP semantics and avoid overusing 200/500 as generic statuses.
