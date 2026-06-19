# Docs Locale Menu Design

## Summary

Expose the new Chinese docs in the top site navigation by turning the current `Docs` header item into a locale chooser for English and Chinese docs.

## Context

The site now has two docs trees in the new renderer:

- English docs under `/docs/...`
- Chinese docs under `/zhCN-docs/...`

The Chinese docs entry route already exists and redirects correctly:

- `/zhCN-docs` -> `/zhCN-docs/start/what-is-apihug`

But the top header still exposes stale links:

- the main desktop nav only shows a single English `Docs` link
- the Chinese header badge still points at `/zhCN-docs/start.html`
- the mobile popover still links to `/zhCN`

That makes the migrated Chinese docs hard to discover and keeps the header inconsistent with the new App Router route structure.

## Goals

- Make Chinese docs visible from the top navigation.
- Keep English docs as the default docs destination.
- Normalize stale Chinese header links to the new `/zhCN-docs` route.
- Keep the change scoped to header navigation only.

## Non-Goals

- No changes to docs sidebar structure.
- No changes to docs page content or route layout.
- No automatic locale detection.
- No large header redesign or mega menu.

## Proposed Design

### 1. Desktop Header

Replace the current single `Docs` nav item in the desktop header with a compact dropdown trigger labeled `Docs`.

The dropdown contains:

- `English Docs` -> `/docs`
- `中文文档` -> `/zhCN-docs`

The menu should match the existing header tone:

- compact panel
- lightweight hover/focus states
- keyboard-focusable links
- no separate full-width navigation treatment

The user should be able to discover the locale choice without the header feeling heavier than it does today.

### 2. Mobile Header

Do not add a nested dropdown to the mobile popover.

Instead, expose two flat links in the existing mobile nav list:

- `English Docs` -> `/docs`
- `中文文档` -> `/zhCN-docs`

This keeps mobile navigation simple and avoids a second layer of popover interaction for a two-option choice.

### 3. Chinese Badge and Legacy Header Links

Normalize existing Chinese docs links in the header to the new route entry:

- replace `/zhCN-docs/start.html` with `/zhCN-docs`
- replace `/zhCN` with `/zhCN-docs`

This keeps all visible header links aligned to the migrated route namespace and avoids advertising legacy static paths.

## Interaction Notes

- Desktop dropdown should work with pointer and keyboard interaction.
- The default docs concept remains English-first, but the locale alternatives are visible in one place.
- Mobile stays explicit rather than interactive: two links, no nested menu state.

## Implementation Scope

Primary file:

- `src/components/Header.js`

Likely supporting changes:

- add a small local dropdown structure inside the existing header component
- update stale href targets in the existing featured Chinese badge and nav items

No changes are required to:

- docs content loaders
- docs sidebar
- route definitions
- MDX rendering

## Verification

Add regression coverage that checks:

- the header source contains `/docs` and `/zhCN-docs` as the docs locale targets
- the old `/zhCN-docs/start.html` header link is removed
- the old `/zhCN` mobile/header link is removed

Manual verification:

- desktop header shows `Docs` with both locale entries
- mobile popover shows both locale links
- Chinese badge/header links land on `/zhCN-docs`

## Risks

- Mixing dropdown behavior into the existing header can introduce unnecessary complexity if overbuilt.
- Mobile and desktop nav can drift if link targets are duplicated carelessly.

These risks are controlled by:

- keeping the dropdown small
- keeping locale links explicit
- verifying the final header targets in tests

## Rollout

1. Add the header regression test for the new docs locale targets.
2. Update the header nav structure and stale Chinese links.
3. Verify desktop and mobile header behavior locally.
