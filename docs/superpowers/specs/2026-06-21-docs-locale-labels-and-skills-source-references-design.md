# Docs Locale Labels and Skills Source References

## Summary

This change does two small but visible cleanup tasks in the production docs experience:

1. simplify the top `Docs` locale dropdown labels to `English` and `中文`
2. add clear source-of-truth references for ApiHug Skills, Spring extension runtime guidance, and rules guidance

The goal is to make the locale menu cleaner and make it obvious where the official upstream skills and runtime rule material lives.

## Problem

The current docs header still uses uneven locale labels:

- desktop dropdown shows `English Docs`
- Chinese label is mojibake-corrupted in the runtime header source
- mobile labels are not aligned cleanly with desktop wording

The current docs content also lacks a clear official reference note for the upstream ApiHug Skills project:

- users reading the docs do not see the official `apihug/skills` repository surfaced clearly
- Spring runtime extension documentation in the site does not clearly point to the `skills/spring-extension` source area
- rules documentation in the site does not clearly point to the `skills/rules` source area
- the zhCN skills overview page is still corrupted and cannot carry a professional reference note in its current state

## Goals

- make the locale switch labels short and clean: `English` and `中文`
- keep desktop and mobile docs locale labels consistent
- add an explicit official reference note to the skills overview pages
- add an explicit official reference note to the rules pages
- add an explicit source-of-truth note to the Spring Common overview pages
- repair the zhCN skills overview page so it is readable and professional

## Non-Goals

- no docs IA or sidebar reorder changes
- no spring content rewrite beyond adding source-reference notes
- no route changes
- no changes to docs menu interaction behavior
- no automatic sync from the external skills repository

## Source of Truth

The upstream material being referenced is:

- official repository: `https://github.com/apihug/skills`
- Spring extension source area: `D:\Aaron\workspace\projects\idea\apihug-skills\skills\spring-extension`
- runtime rule source area: `D:\Aaron\workspace\projects\idea\apihug-skills\skills\rules`

These references are informational in this pass. The docs site remains curated rather than mirroring the upstream repo directly.

## Design

### 1. Header locale labels

Update the runtime header locale menu so the visible entries are:

- `English`
- `中文`

Apply the same labels in:

- desktop `Docs` dropdown
- mobile navigation list

Do not rename the trigger itself. The trigger remains `Docs`.

### 2. Skills overview references

Update the English and zhCN skills overview pages to include a short reference section that explains:

- the official ApiHug Skills project is maintained in `github.com/apihug/skills`
- the framework and runtime guidance used by this docs section comes from curated material in that project
- the Spring runtime extension material lives under `skills/spring-extension`
- the rule documents live under `skills/rules`

This section should read like product documentation, not a raw repository dump.

### 3. Rules page references

Update the English and zhCN rules pages with a tighter source note that explains:

- the rule summaries in the site are curated from the official ApiHug Skills rules set
- the detailed upstream rule material lives in the official repository under `skills/rules`
- the rule families surfaced here include protobuf extension rules, database modeling, enum/error design, backend implementation, and frontend implementation

### 4. Spring Common source references

Update the English and zhCN Spring Common overview pages with a short source-of-truth note stating:

- the runtime Spring extension details are maintained in the official ApiHug Skills repository
- the related upstream material lives under `skills/spring-extension`
- the site page remains the curated docs view, while the upstream repository contains the broader supporting material

This is intentionally a reference note, not a full content rewrite.

### 5. zhCN skills overview repair

Rewrite the zhCN skills overview page into clean Chinese so it can carry the same source-reference information as the English page.

Requirements:

- keep the same route and page purpose
- keep the same overall structure as the English page
- preserve stable skill ids and route names in English where appropriate
- remove mojibake and partial-translation artifacts

## Files in Scope

- `src/components/header.tsx`
- `src/docs/skills/index.mdx`
- `src/zhCN-docs/skills/index.mdx`
- `src/docs/skills/rules.mdx`
- `src/zhCN-docs/skills/rules.mdx`
- `src/docs/framework/spring-common.mdx`
- `src/zhCN-docs/framework/spring-common.mdx`
- `tests/docs-migration.test.mjs`
- `tests/production-cleanup.test.mjs` if needed for text regressions

## Verification

- header source contains `English` and `中文` for docs locale entries
- updated docs pages mention:
  - `github.com/apihug/skills`
  - `spring-extension`
  - `rules`
- `src/zhCN-docs/skills/index.mdx` is readable Chinese rather than mojibake
- `node --test tests/docs-migration.test.mjs tests/production-cleanup.test.mjs`
- `pnpm build`
- restart the local clean-URL export server on `3001`
- spot-check:
  - `/docs/start/what-is-apihug`
  - `/docs/skills`
  - `/docs/skills/rules`
  - `/docs/framework/spring-common`
  - `/zhCN-docs/skills`
  - `/zhCN-docs/skills/rules`
  - `/zhCN-docs/framework/spring-common`

## Risks

- the zhCN docs tree still contains some older migrated pages, so this pass must avoid broad locale rewrites outside the targeted files
- the Spring Common pages already contain older prose; adding references should stay narrow and not reopen the whole framework editorial scope
- header text regression tests should target the live runtime file, not legacy component files
