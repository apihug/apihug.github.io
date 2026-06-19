# Desktop Logo Subtitle Design

## Goal

Improve the visual balance of the desktop header by giving the left-side brand lockup more weight, without changing mobile behavior or the overall navigation structure.

## Current Problem

The current desktop header uses only the logo image as the left anchor. In the live header layout, the right side carries more visual density because it includes search, docs navigation, changelog, and GitHub. That makes the left side feel too light and visually undersized.

## Chosen Approach

Add a desktop-only two-part brand lockup:

- Keep the existing logo image on the left.
- Add a compact text block on the right.
- Show `ApiHug` as the primary label.
- Show `API as Architecture` as a quieter subtitle below it.

This keeps the brand image as the main anchor while adding width and hierarchy to the header.

## Rejected Alternatives

### Inline one-line subtitle

Placing the subtitle on the same row as the logo creates a cramped header and reduces readability in the available space.

### Increase logo size only

Making the image larger adds bulk but not structure. It does not communicate the brand idea and is more likely to distort the current header rhythm.

## Component Design

### `src/components/logo.tsx`

The logo component will render two variants:

- Mobile: unchanged current image-only logo.
- Desktop: image plus a stacked text block.

Desktop text block structure:

- top line: `ApiHug`
- second line: `API as Architecture`

The text block should sit to the right of the image and be vertically centered inside the existing header height.

### `src/components/header.tsx`

Only minimal alignment adjustments are allowed if needed to keep the new lockup visually centered in the current `h-14` top bar.

No navigation behavior, menu structure, or mobile header changes are in scope.

## Typography and Visual Rules

- The subtitle is desktop-only and hidden below `md`.
- `ApiHug` should read as a compact, semibold label.
- `API as Architecture` should use smaller mono uppercase styling with a muted gray tone.
- The text should support the logo image rather than overpower it.
- The lockup must remain compact enough that the desktop header does not feel crowded.

## Scope

In scope:

- desktop brand lockup in `logo.tsx`
- minimal header alignment follow-up in `header.tsx` if necessary
- regression coverage for the desktop-only subtitle behavior

Out of scope:

- mobile header changes
- navigation changes
- homepage hero or other page content
- global typography changes

## Verification

- Add a regression test that confirms the desktop logo component includes `API as Architecture`.
- Confirm the subtitle is hidden on mobile and present only in the desktop lockup markup.
- Run the relevant test file.
- Run a full build.
- Restart the local `3001` server and verify the homepage header at desktop width.
