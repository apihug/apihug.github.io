# Docs Code Block Redesign

## Summary

Redesign the docs code block UI to follow the Tailwind docs pattern used on the `using-vite` installation page. The goal is to make standalone code fences and tabbed snippet groups look like intentional product docs components instead of generic dark markdown panels.

## Context

The current docs migration restored rendering and copy behavior, but the code block presentation is still visually heavy:

- Standalone blocks use a dark header strip with a text-first copy button.
- Snippet groups read as two stacked treatments rather than one coherent component.
- Header labels are weak or absent for normal markdown fences.
- The overall block chrome is bulkier than the Tailwind reference.

The user explicitly wants the docs code blocks to follow the look and feel of Tailwind's installation steps such as `Create your project`.

## Goals

- Make docs code blocks feel visually close to Tailwind's docs treatment.
- Use one shared visual language across `DocsCodeBlock` and `SnippetGroup`.
- Show a clear left-side header label for every non-compact code block.
- Use an icon-led copy action with restrained hover and copied states.
- Tighten spacing, border treatment, and header/body separation.
- Preserve current markdown rendering and copy behavior.

## Non-Goals

- No redesign of the broader docs layout, sidebar, TOC, or page typography.
- No content migration changes in this pass.
- No syntax-highlighting engine swap.
- No change to compact inline-style code presentations unless required for consistency.

## Reference Pattern

Tailwind's installation docs use a compact code panel with these traits:

- A dedicated header row.
- A left-aligned label such as `Terminal`, `CSS`, or a filename.
- A small copy action on the right that does not dominate the header.
- A single rounded container with restrained borders and balanced spacing.
- Consistent use across standalone and step-based examples.

This redesign will follow that structure closely while staying inside the current ApiHug docs stack.

## Proposed Design

### 1. Shared Component Shape

Both standalone fences and snippet groups will use the same container model:

- Rounded outer shell.
- Dedicated top bar.
- Left header label.
- Right utility action.
- Code body beneath the header.

This should read as one component family, even though `SnippetGroup` still supports tabs.

### 2. Standalone Code Blocks

`DocsCodeBlock` will render:

- A slimmer top bar than the current `h-10` header.
- A left label derived from the strongest available source:
  - explicit filename or title if available later,
  - otherwise a language-derived fallback such as `Shell`, `JSON`, `Java`, `TypeScript`,
  - otherwise `Code`.
- A compact copy action on the right with icon-first presentation.
- A lighter container/background treatment than the current heavy slate panel.

Compact mode remains available and should avoid unnecessary chrome.

### 3. Snippet Group Blocks

`SnippetGroup` will be restyled so the tabs and action area behave like one top bar:

- Selected tab remains the visible title state.
- The right side holds the shared copy action.
- Backgrounds, dividers, corner treatment, and padding align with standalone blocks.
- The tab row should no longer feel like a separate band sitting above a second code panel.

The active tab remains the source for copied content.

### 4. Copy Action

The copy control will move closer to the Tailwind pattern:

- Icon-only at rest.
- Subtle hover background and focus ring.
- Short-lived copied confirmation state.
- Accessible `aria-label` for both idle and copied states.

The idle state should not use the current visible `Copy` text.

### 5. Visual Treatment

The redesign will tighten the current visual weight:

- Smaller header height.
- More restrained padding.
- Cleaner border between header and body.
- Less visually dense background.
- Slightly sharper typography rhythm for shell and config examples.

The result should remain compatible with the existing docs dark code aesthetic, but much closer to Tailwind's proportion and hierarchy.

## Implementation Scope

Primary files:

- `src/components/DocsCodeBlock.tsx`
- `src/components/CodeCopyButton.tsx`
- `src/components/SnippetGroup.js`

Possible support updates:

- `src/app/typography.css`
- `mdx-components.tsx`
- `tests/docs-migration.test.mjs`

No other docs components should change unless a minimal adjustment is required to support header labels or shared styling.

## Header Label Rules

To avoid empty or inconsistent headers:

1. `SnippetGroup` uses the selected tab filename/title.
2. `DocsCodeBlock` uses explicit metadata if present.
3. If no explicit metadata exists, derive from language class where possible.
4. Fallback label is `Code`.

This prevents unlabeled blocks and aligns with the Tailwind-style expectation that each block has context.

## Accessibility

- Copy button remains keyboard reachable.
- Focus-visible treatment must remain obvious on dark backgrounds.
- `aria-label` changes to reflect idle/copied state.
- Header labels should remain text, not icon-only, so screen readers and sighted users both get context.

## Testing

Regression coverage will assert:

- `DocsCodeBlock` includes a left-side header label region.
- `CodeCopyButton` supports icon-led copy treatment without the old always-visible text label.
- `SnippetGroup` uses the shared top-bar structure and still copies the active tab.
- Existing markdown code block rendering behavior stays intact.

Manual verification will use the local docs route, especially `/docs/start`.

## Risks

- Overfitting to Tailwind's look without respecting current docs constraints.
- Breaking snippet group copy behavior while refactoring header layout.
- Introducing unlabeled blocks if language/title fallbacks are incomplete.

These risks are controlled by keeping the change scoped to the three code-block components and adding regression coverage for header/copy behavior.

## Rollout

1. Add or update regression tests for the new structure.
2. Refactor `CodeCopyButton` to icon-led behavior.
3. Refactor `DocsCodeBlock` header/body structure.
4. Refactor `SnippetGroup` to share the same top-bar language.
5. Run tests, build, and verify visually on local docs pages.
