# Changelog Detail Cleanup Design

Date: 2026-06-21

## Goal

Clean up the remaining legacy changelog detail pages so they read like professional release-history documentation without changing the underlying historical technical content.

This pass focuses on the main live detail pages, not the entire changelog tree.

## Why This Is Needed

The broader docs migration and editorial audit are already in good shape, but the changelog detail pages still contain the most obvious legacy residue:

- broken or awkward English prose
- half-localized zhCN pages
- corrupted locale switch labels
- inconsistent resource lines and warnings
- migration steps that are technically useful but written in an unpolished way

These pages are historical notes, but they are still public docs. They need to be readable and consistent.

## In Scope

Primary files:

- `src/docs/changelog/detail/SDK_0.8.6.mdx`
- `src/zhCN-docs/changelog/detail/SDK_0.8.6.mdx`
- `src/docs/changelog/detail/SDK_0.7.8.mdx`
- `src/zhCN-docs/changelog/detail/SDK_0.7.8.mdx`

Supporting verification updates:

- `tests/docs-release-history.test.mjs`
- `tests/docs-migration.test.mjs` only if needed for route or locale assertions

## Out Of Scope

This pass does not:

- rewrite the `_cn` mirror pages unless the main routes depend on them
- change release facts, code samples, screenshots, or migration behavior
- redesign changelog navigation
- touch unrelated milestone pages unless a broken link forces a tiny correction

## Page Roles

### `SDK_0.8.6`

This page should be treated as a short release note explaining the problem solved by the release:

- why generated code diffs were noisy before
- what improved in `0.8.6-RELEASE`
- how it relates to the earlier `0.7.8` repository-maintenance redesign

It should remain concise and not become a long migration tutorial.

### `SDK_0.7.8`

This page should remain a migration guide:

- explain the repository / trait split clearly
- preserve the step-by-step migration examples
- keep warnings and post-migration tips
- improve the surrounding narrative so it reads cleanly in both locales

## Editorial Rules

### Shared Rules

- Keep all existing code blocks unless there is a clear typo in surrounding explanatory text.
- Keep release numbers, file paths, and historical references intact.
- Replace broken or jokey prose with direct technical explanation.
- Keep headings short and scannable.
- Use the same structure in both locales where practical.

### English Rules

English pages should read like concise release documentation:

- describe the issue
- explain the impact
- show the migration or outcome
- close with practical notes

Avoid:

- exaggerated tone
- broken grammar
- slang like "crazy stuff"
- legacy filler such as "better keep rolling release with us"

### zhCN Rules

zhCN pages should be actual Chinese technical docs, not English pages with partial substitutions.

Keep:

- identifiers, version numbers, code symbols, and command names in English where needed

Fix:

- locale switch labels
- mixed English narrative paragraphs
- mojibake or corrupted punctuation

## Proposed Cleanup Shape

### `SDK_0.8.6` English

Recommended structure:

1. title and short description
2. issue summary
3. what changed in `0.8.6-RELEASE`
4. relation to `0.7.8`
5. note about meta file timestamps

### `SDK_0.8.6` zhCN

Mirror the same structure as English, but localized naturally.

### `SDK_0.7.8` English

Keep existing sections, but clean:

- intro paragraph
- warning copy
- step explanations
- postscript wording
- best-practice closing notes

### `SDK_0.7.8` zhCN

Keep the same migration structure, but localize the narrative shell into clean Chinese.

## Specific Quality Targets

After this pass:

- no broken locale switch text on the main detail pages
- no obviously broken grammar in the top narrative sections
- no mixed-language prose on the main zhCN detail pages except for identifiers and code
- no stale warning phrasing like "you will got" or "merger them back" outside preserved historical code comments
- release detail pages still point correctly to the related milestone/changelog pages

## Verification

Required verification:

1. `node --test tests/docs-release-history.test.mjs`
2. `node --test tests/production-cleanup.test.mjs tests/docs-migration.test.mjs tests/docs-release-history.test.mjs`
3. `pnpm build`
4. clean rebuild and restart on port `3001`
5. spot-check:
   - `/docs/changelog/detail/SDK_0.8.6`
   - `/zhCN-docs/changelog/detail/SDK_0.8.6`
   - `/docs/changelog/detail/SDK_0.7.8`
   - `/zhCN-docs/changelog/detail/SDK_0.7.8`

## Risks

### Historical distortion

Over-editing can make old release notes less trustworthy. Mitigation: rewrite only the narrative shell, not the technical facts.

### Cross-locale drift

If English and zhCN are edited independently, they will diverge again. Mitigation: keep the same section intent and cleanup goals in both locales.

### Legacy code-comment confusion

Some awkward words inside code comments are part of historical generated examples. Mitigation: preserve code blocks unless they become actively misleading.

## Recommended Next Step

After this spec is approved, write a short implementation plan and execute the cleanup directly in the current workspace, then do the requested clean rebuild and restart.
