---
title: 数据库指令规范
description: 数据库 proto 生成
---

## 数据库设计规范

本说明描述在 `.proto` 中如何使用 `domain` 目录下的定义，将领域模型映射为关系型数据库中的表、列和视图，可作为人和大模型共同参考的约定。

### 1. 使用场景
- 将业务实体映射为数据库表。
- 为实体定义不同用途的视图（列表视图、详情视图、聚合视图等）。
- 在需要时附加特定数据库的自定义 DDL 片段。

主要依赖：
- `apihug/protobuf/domain/persistence.proto`
- `apihug/protobuf/domain/view.proto`
- `apihug/protobuf/domain/annotations.proto`
- `apihug/protobuf/extend/common.proto`

### 2. 文件和基础结构
1. 每个需要持久化的业务实体，建议使用一个独立的 `.proto` 文件描述。
2. 基本头部示例：
   ```proto
   syntax = "proto3";
   package your.domain;

   import "apihug/protobuf/domain/annotations.proto";
   ```
3. 一个实体 message 通常对应一张逻辑表，例如：`message Pet { ... }`。

### 3. message 与表： (hope.persistence.table)

1. 在实体 message 上通过 `(hope.persistence.table)` 声明表信息：
   ```proto
   message Pet {
     option (hope.persistence.table) = {
       name: "PET";           // 表名，推荐大写下划线
       description: "宠物";   // 表用途说明
       // 可按需设置：catalog, schema
       // 可按需设置：unique_constraints, indexes
       // 可按需设置：views, wires, liquibase
     };

     // 字段定义见下一节
   }
   ```
2. 表名 `name` 建议与实际数据库表名保持一致；`description` 用自然语言简要说明业务含义。

### 4. 字段与列： (hope.persistence.column)

1. 对每个需要入库的字段，建议都加上 `(hope.persistence.column)` 元数据：
   ```proto
   string name = 1 [(hope.persistence.column) = {
     name: "NAME";
     description: "宠物名称";
     nullable: FALSE;
     type: VARCHAR;
   }];
   ```
2. 常用字段含义：
   - 标识相关：
     - `id`：是否为主键列，类型为 `hope.common.BoolType`。
     - `generated_value`：主键生成策略，包含 `strategy`（如 `UUID`、`SEQUENCE` 等）和 `generator` 名称。
   - 约束相关：
     - `unique`：是否唯一键。
     - `nullable`：是否允许为 `NULL`。
     - `insertable` / `updatable`：是否参与插入 / 更新。
     - `searchable` / `sortable`：是否用于过滤 / 排序。
   - 类型与长度：
     - `type`：使用 `Column.Type` 指定 SQL 类型，如 `VARCHAR`、`INTEGER`、`DATE` 等。
     - 字符串长度：使用 `length`（`google.protobuf.Int32Value`）。
     - 小数：使用 `precision` 和 `scale` 控制精度。
   - 枚举：
     - `enum_type`：`STRING` 或 `CODE`，分别表示持久化哪种枚举表示。
   - 其他：
     - `table`：当字段位于辅助表时，标明具体表名。
     - `column_definition`：自定义 SQL 片段，仅在确有需要时使用。
     - `transient`：标记字段为非持久化，只用于视图或计算。

### 5. 视图定义：View

**非用户指定需要**，勿添加view!!

1. 若同一实体在不同场景下需要不同字段集合，可在 `Table.views` 中定义视图：
   ```proto
   option (hope.persistence.table) = {
     name: "PET";
     description: "宠物";
     views: [
       {
         name: "summary";
         description: "列表视图";
         includes: ["id", "name", "category"];
         excludes: ["description"];
       }
     ];
   };
   ```
2. 视图字段规则：
   - `includes`：显式包含的字段列表，优先级高于 `excludes`。
   - `excludes`：需要从默认字段集中排除的字段。
3. 若需要统计或聚合列，可使用 `AggregatedField`：
   ```proto
   aggregated_fields: [{
     type: COUNT;
     alias: "total";
   }];
   ```
4. 若视图需要连接其他实体，可使用 `ReferenceView`：
   ```proto
   references: [{
     entity: "Category";      // 目标实体名
     view: "summary";         // 目标实体上的视图名
     join_type: INNER;
     left_field: "category";  // 当前实体字段
     right_field: "name";     // 目标实体字段
   }];
   ```

### 6. 内置通用特性：Table.wires

`wires` 用于表示是否应用平台内置的一些通用领域特性（例如审计、逻辑删除、多租户等），使用方式示例：

- 使用全部内置特性：
  ```proto
  wires: [ALL];
  ```
- 只使用部分特性：
  ```proto
  wires: [AUDITABLE, DELETABLE];
  ```
- 完全自行控制：
  ```proto
  wires: [NONE];
  ```

具体可用值以 `Table.Wire` 枚举为准。


### 7. 建模建议（面向实现者和大模型）

1. 为每个需要持久化的实体设计一个 message，并在其上声明 `(hope.persistence.table)`。
2. 为每个需要入库的字段添加 `(hope.persistence.column)`，补充必要的约束与类型信息。
3. 如果存在多个展示场景（列表、详情、报表等），优先通过 `View`/`AggregatedField`/`ReferenceView` 建模视图，而不是复制多个实体。
4. 遇到特殊数据库兼容或复杂 DDL 场景时，再考虑为该表追加 `Liquibase` 条目，而不是直接修改已有版本记录。
