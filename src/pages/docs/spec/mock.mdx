---
title: Mock Data Design Specification
description: Mock Data Design Specification
---

## Mock Data Design Specification

This document describes how to use definitions from the `mock` directory in `.proto` files to configure repeatable test data generation rules for fields or interfaces.

### 1. Use Cases and Locations
- Field-level Mock:
  - Set `mock` in the JSONSchema corresponding to `(hope.swagger.field)` on the field to generate sample data for that field.
- Response-level Mock:
  - Set `mock` in the response extension of `option (hope.swagger.operation)` to provide sample data for simple type responses.

Main dependencies:
- `apihug/protobuf/mock/mock.proto`
- Reference to `mock.Mock` in `apihug/protobuf/swagger/swagger.proto`

### 2. Mock Top-Level Structure

`mock.Mock` uses `oneof rule` to represent different types of generation rules. Common branches include:

- `nature`: Generate content based on semantic categories (animal names, country names, email, URL, etc.).
- `string_rule`: Generate strings by length range and character pool.
- `bool_rule`: Control boolean value distribution.
- `number_rule`: Generate numbers by value range and decimal places.
- `date_rule`: Generate dates/times by age range or time interval.
- `image_rule`: Generate image placeholder information with specified width, height, background color, and text.
- `color_rule`: Generate color values in different formats (HEX, RGB, RGBA, HSL, name, etc.).
- `chinese_rule`: Generate Chinese paragraphs, sentences, words, or titles.
- `chinese_name_rule`: Generate Chinese names (first name, last name, full name).
- `china_address_rule`: Generate Chinese region/address information.

### 3. Choosing Rules by Field Semantics

1. General string fields (name, remarks, code, etc.)
   ```proto
   mock: {
     string_rule: {
       min: 3;
       max: 20;
       pool: LOWER;
     };
   }
   ```
   If there are limited candidate values, use `candidates`:
   ```proto
   mock: {
     string_rule: {
       candidates: ["PENDING", "DONE"];
     };
   }
   ```

2. Numeric fields (price, quantity, ID, etc.)
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

3. Boolean fields
   Generally no rule needs to be specified; if you prefer a certain value, you can set `current`:
   ```proto
   mock: {
     bool_rule: {
       current: TRUE;
     };
   }
   ```

4. Date/time fields (birthday, creation time, expiration time, etc.)
   - Birthday:
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
   - Relative to current time (past/future):
     ```proto
     mock: {
       date_rule: {
         time_gap: 30;
         time_unit: DAYS;
         dir: PAST;
       };
     }
     ```

5. Chinese text fields (title, body text, phrases, etc.)
   ```proto
   mock: {
     chinese_rule: {
       type: TITLE;      // or PARAGRAPH / SENTENCE / WORD
       min: 5;
       max: 20;
     };
   }
   ```

6. Chinese names, addresses, etc.
   - Chinese name:
     ```proto
     mock: {
       chinese_name_rule: {
         type: NAME;     // FIRST / LAST / NAME
       };
     }
     ```
   - Chinese address:
     ```proto
     mock: {
       china_address_rule: {
         type: ADDRESS;  // REGION/PROVINCE/CITY/COUNTY/ADDRESS
         with_prefix: TRUE;
       };
     }
     ```

7. Strings with clear semantics like email, URL, IP, etc.
   Recommended to use `nature`:
   ```proto
   mock: { nature: EMAIL; }
   mock: { nature: URL; }
   mock: { nature: IP4; }
   ```

### 4. Combined Use with swagger

1. Field-level mock example:
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

2. Response-level mock example (simple types):
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

### 5. Usage Recommendations

1. First determine the appropriate rule branch based on the field or response type (string, number, boolean, time, etc.), then select more specific configurations based on business semantics.
2. For scenarios that only need a single example value, you can prioritize using `example` on the swagger field. Use mock rules when you need large amounts of random data or automated testing.
3. For list and pagination structures, you can describe collection size and structure through JSONSchema's `max_items` / `min_items` and Operation's `pageable` / `input_repeated` / `out_repeated`, focusing mock rules on the generation logic of elements themselves.
