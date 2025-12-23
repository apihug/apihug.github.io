---
title: Database Design Specification
description: Database Design Specification
---

## Database Design Specification

This document describes how to use definitions from the `domain` directory in `.proto` files to map domain models to tables, columns, and views in relational databases. It serves as a convention for both humans and large language models.

### 1. Use Cases
- Map business entities to database tables.
- Define different-purpose views for entities (list view, detail view, aggregated view, etc.).
- Attach database-specific custom DDL fragments when needed.

Main dependencies:
- `apihug/protobuf/domain/persistence.proto`
- `apihug/protobuf/domain/view.proto`
- `apihug/protobuf/domain/annotations.proto`
- `apihug/protobuf/extend/common.proto`

### 2. Files and Basic Structure
1. For each business entity that needs persistence, it is recommended to use a separate `.proto` file for description.
2. Basic header example:
   ```proto
   syntax = "proto3";
   package your.domain;

   import "apihug/protobuf/domain/annotations.proto";
   ```
3. An entity message typically corresponds to a logical table, for example: `message Pet { ... }`.

### 3. message and Table: (hope.persistence.table)

1. Declare table information on the entity message using `(hope.persistence.table)`:
   ```proto
   message Pet {
     option (hope.persistence.table) = {
       name: "PET";           // Table name, recommended uppercase with underscores
       description: "宠物";   // Table description
       // Optional: catalog, schema
       // Optional: unique_constraints, indexes
       // Optional: views, wires, liquibase
     };

     // Field definitions see next section
   }
   ```
2. The table `name` should be consistent with the actual database table name; `description` uses natural language to briefly explain business meaning.

### 4. Fields and Columns: (hope.persistence.column)

1. For each field that needs to be persisted, it is recommended to add `(hope.persistence.column)` metadata:
   ```proto
   string name = 1 [(hope.persistence.column) = {
     name: "NAME";
     description: "宠物名称";
     nullable: FALSE;
     type: VARCHAR;
   }];
   ```
2. Common field meanings:
   - Identity-related:
     - `id`: Whether it is a primary key column, type is `hope.common.BoolType`.
     - `generated_value`: Primary key generation strategy, including `strategy` (e.g., `UUID`, `SEQUENCE`, etc.) and `generator` name.
   - Constraint-related:
     - `unique`: Whether it is a unique key.
     - `nullable`: Whether `NULL` is allowed.
     - `insertable` / `updatable`: Whether it participates in insert / update operations.
     - `searchable` / `sortable`: Whether it is used for filtering / sorting.
   - Type and length:
     - `type`: Use `Column.Type` to specify SQL type, such as `VARCHAR`, `INTEGER`, `DATE`, etc.
     - String length: Use `length` (`google.protobuf.Int32Value`).
     - Decimals: Use `precision` and `scale` to control precision.
   - Enum:
     - `enum_type`: `STRING` or `CODE`, representing which enum representation to persist.
   - Others:
     - `table`: When the field is in an auxiliary table, specify the table name.
     - `column_definition`: Custom SQL fragment, only use when necessary.
     - `transient`: Mark the field as non-persistent, only used for views or calculations.

### 5. View Definition: View

**Unless specified by user**, do not add views!!

1. If the same entity requires different field sets in different scenarios, you can define views in `Table.views`:
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
2. View field rules:
   - `includes`: Explicitly included field list, higher priority than `excludes`.
   - `excludes`: Fields that need to be excluded from the default field set.
3. If statistics or aggregation columns are needed, you can use `AggregatedField`:
   ```proto
   aggregated_fields: [{
     type: COUNT;
     alias: "total";
   }];
   ```
4. If the view needs to join other entities, you can use `ReferenceView`:
   ```proto
   references: [{
     entity: "Category";      // Target entity name
     view: "summary";         // View name on target entity
     join_type: INNER;
     left_field: "category";  // Current entity field
     right_field: "name";     // Target entity field
   }];
   ```

### 6. Built-in Common Features: Table.wires

`wires` represents whether to apply some built-in common domain features of the platform (e.g., auditing, soft delete, multi-tenancy, etc.). Usage example:

- Use all built-in features:
  ```proto
  wires: [ALL];
  ```
- Use only some features:
  ```proto
  wires: [AUDITABLE, DELETABLE];
  ```
- Completely self-controlled:
  ```proto
  wires: [NONE];
  ```

Specific available values are based on the `Table.Wire` enum.


### 7. Modeling Recommendations (For Implementers and LLMs)

1. Design a message for each entity that needs persistence and declare `(hope.persistence.table)` on it.
2. Add `(hope.persistence.column)` to each field that needs to be persisted, supplementing necessary constraint and type information.
3. If there are multiple presentation scenarios (list, detail, report, etc.), prioritize modeling views through `View`/`AggregatedField`/`ReferenceView` instead of duplicating multiple entities.
4. When encountering special database compatibility or complex DDL scenarios, then consider adding `Liquibase` entries for that table, rather than directly modifying existing version records.
