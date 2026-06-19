# Swagger Docs Alignment Design

## Goal

Align the ApiHug swagger documentation with the current `it-proto-extend` proto surface so readers can understand both the practical usage and the full extension contract without reading the proto files directly.

## Problem

The current `/docs/protobuf/proto-oas` page is only a high-level overview. It does not explain many important ApiHug swagger extensions now present in `apihug/protobuf/swagger/swagger.proto`, including:

- `pageable`
- `raw`
- `input_repeated`
- `output_repeated`
- `parameters`
- `response_media_type`
- `multipart`
- `group`
- `questions`
- `internal`
- `hide`
- response customization such as `body_empty`, `mock`, and `response_schema`

At the same time, `/docs/spec/swagger` is the natural reference page, but it is still partially incomplete for the current proto surface. This creates ambiguity about which page is authoritative.

## Chosen Approach

Update both pages with distinct roles:

- `/docs/protobuf/proto-oas` becomes the practical guide
- `/docs/spec/swagger` becomes the authoritative field-level reference

Both pages will be aligned against:

- `it-proto-extend/src/main/proto/apihug/protobuf/swagger/annotations.proto`
- `it-proto-extend/src/main/proto/apihug/protobuf/swagger/swagger.proto`

## Content Split

### `src/docs/protobuf/proto-oas.mdx`

This page should explain how to use the ApiHug swagger DSL in practice.

Add or expand sections for:

- service-level mapping with `hope.swagger.svc`
- operation-level mapping with `hope.swagger.operation`
- HTTP verb patterns
- tags, priority, and authorization
- `pageable` behavior
- `raw` response behavior
- collection semantics:
  - deprecated `input_plural` / `out_plural`
  - current `input_repeated` / `output_repeated`
- `parameters` for query/path/header/cookie-style inputs
- `multipart`
- `response_media_type`
- schema customization:
  - `request_schema`
  - `response_schema`
  - `body_empty`
  - `mock`
- visibility and lifecycle controls:
  - `group`
  - `internal`
  - `hide`
- LLM-facing hints through `questions`

This page should stay narrative and example-driven.

### `src/docs/spec/swagger.mdx`

This page should document the full extension surface as reference material.

Expand it to cover:

- extension points from `annotations.proto`:
  - `operation`
  - `svc`
  - `schema`
  - `field`
  - `enm`
- `ServiceSchema`
- `Operation`
  - media types
  - request/response shaping
  - collection and pageable flags
  - visibility controls
  - AI-facing hints
  - response customization
- relevant `JSONSchema` usage in the swagger context
- deprecations:
  - `request`
  - `response`
  - `input_plural`
  - `out_plural`
  - `multiple`

This page should be structured as the contract reference, not a tutorial.

## Rejected Alternative

### Only update `proto-oas.mdx`

Rejected because it would still leave the spec page partially stale, forcing readers to choose between an overview page and an incomplete reference page. That is exactly the ambiguity this change is meant to remove.

## Scope

In scope:

- `src/docs/protobuf/proto-oas.mdx`
- `src/docs/spec/swagger.mdx`
- regression coverage for key current swagger fields in both docs pages

Out of scope:

- generator or runtime code changes
- route changes
- nav redesign
- non-swagger proto docs

## Verification

- Add regressions in `tests/docs-migration.test.mjs` for the new key swagger concepts on both pages.
- Run `node --test tests/docs-migration.test.mjs`.
- Run `pnpm build`.
- Restart `3001`.
- Spot-check:
  - `/docs/protobuf/proto-oas`
  - `/docs/spec/swagger`

## Notes

The goal is not to reproduce every line of `swagger.proto` verbatim. The goal is to ensure that all important current ApiHug swagger extension concepts are represented in the right page with the right level of detail:

- overview and usage in `proto-oas`
- exact contract reference in `spec/swagger`
