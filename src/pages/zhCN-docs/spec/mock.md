---
title: Mock 指令规范
description: Mock 对象生成
---

## Mock 数据设计规范

本说明描述如何在 `.proto` 中使用 `mock` 目录下的定义，为字段或接口配置可重复生成的测试数据规则。

### 1. 使用场景与位置
- 字段级 Mock：
  - 在字段上通过 `(hope.swagger.field)` 对应的 JSONSchema 中设置 `mock`，为该字段生成示例数据。
- 响应级 Mock：
  - 在 `option (hope.swagger.operation)` 的响应扩展中设置 `mock`，为简单类型响应提供示例数据。

主要依赖：
- `apihug/protobuf/mock/mock.proto`
- `apihug/protobuf/swagger/swagger.proto` 中对 `mock.Mock` 的引用

### 2. Mock 顶层结构

`mock.Mock` 使用 `oneof rule` 表示不同类型的生成规则，常用分支包括：

- `nature`：基于语义类别生成内容（动物名、国家名、邮箱、URL 等）。
- `string_rule`：按长度范围和字符池生成字符串。
- `bool_rule`：控制布尔值的分布。
- `number_rule`：按数值范围和小数位生成数字。
- `date_rule`：按照年龄范围或时间间隔生成日期/时间。
- `image_rule`：生成带指定宽、高、背景色和文字的图片占位信息。
- `color_rule`：生成不同格式的颜色值（HEX、RGB、RGBA、HSL、名称等）。
- `chinese_rule`：生成中文段落、句子、词或标题。
- `chinese_name_rule`：生成中文姓名（姓、名、全名）。
- `china_address_rule`：生成中国地区/地址信息。

### 3. 按字段语义选择规则

1. 一般字符串字段（名称、备注、代码等）
   ```proto
   mock: {
     string_rule: {
       min: 3;
       max: 20;
       pool: LOWER;
     };
   }
   ```
   若有有限集合的候选值，可使用 `candidates`：
   ```proto
   mock: {
     string_rule: {
       candidates: ["PENDING", "DONE"];
     };
   }
   ```

2. 数值字段（价格、数量、ID 等）
   ```proto
   mock: {
     number_rule: {
       min: 1;
       max: 100000;
       min_fraction: 0;
       max_fraction: 2;
     };
   }
   ```

3. 布尔字段
   一般可不指定规则，如需倾向某一取值可以设置 `current`：
   ```proto
   mock: {
     bool_rule: {
       current: TRUE;
     };
   }
   ```

4. 日期/时间字段（生日、创建时间、过期时间等）
   - 生日：
     ```proto
     mock: {
       date_rule: {
         birth_day: {
           min_age: 18;
           max_age: 60;
         };
       };
     }
     ```
   - 相对当前时间的过去/未来：
     ```proto
     mock: {
       date_rule: {
         time_gap: 30;
         time_unit: DAYS;
         dir: PAST;
       };
     }
     ```

5. 中文文本字段（标题、正文、短语等）
   ```proto
   mock: {
     chinese_rule: {
       type: TITLE;      // 或 PARAGRAPH / SENTENCE / WORD
       min: 5;
       max: 20;
     };
   }
   ```

6. 中文姓名、地址等
   - 中文姓名：
     ```proto
     mock: {
       chinese_name_rule: {
         type: NAME;     // FIRST / LAST / NAME
       };
     }
     ```
   - 中国地址：
     ```proto
     mock: {
       china_address_rule: {
         type: ADDRESS;  // REGION/PROVINCE/CITY/COUNTY/ADDRESS
         with_prefix: TRUE;
       };
     }
     ```

7. 邮箱、URL、IP 等具有明确语义的字符串
   推荐使用 `nature`：
   ```proto
   mock: { nature: EMAIL; }
   mock: { nature: URL; }
   mock: { nature: IP4; }
   ```

### 4. 与 swagger 的结合使用

1. 字段级 mock 示例：
   ```proto
   string phone = 1 [(hope.swagger.field) = {
     description: "手机号";
     example: "13800138000";
     mock: {
       china_address_rule: {
         type: ADDRESS;
       };
     };
   }];
   ```

2. 响应级 mock 示例（简单类型）：
   ```proto
   option (hope.swagger.operation) = {
     post: "/ping";
     mock: {
       string_rule: {
         candidates: ["pong", "ok"];
       };
     };
   };
   ```

### 5. 使用建议

1. 先根据字段或响应的类型（字符串、数值、布尔、时间等）判断适合使用的规则分支，再结合业务语义选择更具体的配置。
2. 对于只需要单个示例值的场景，可以优先使用 swagger 字段上的 `example`，在需要大量随机数据或自动化测试时再使用 mock 规则。
3. 对于列表和分页结构，可通过 JSONSchema 的 `max_items` / `min_items`、Operation 的 `pageable` / `input_repeated` / `out_repeated` 描述集合大小和结构，将 mock 规则聚焦在元素本身的生成逻辑上。
