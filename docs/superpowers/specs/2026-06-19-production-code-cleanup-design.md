# Production Code Cleanup Design

## Goal

Remove legacy and dead code so the repository reflects the current production site only: App Router homepage, English docs, zh-CN docs, and their active shared runtime.

## Scope

This cleanup is code-only.

Included:
- Legacy routing code no longer used by the App Router.
- Obsolete build and config code replaced by the current Next.js 16 + TypeScript setup.
- Duplicate runtime/component implementations that are no longer imported by the live app.
- Dead helper, layout, and compatibility code left behind by the migration.

Excluded:
- Temporary folders and local working artifacts such as `.tmp`, `temp`, and `.qoder`.
- Plan/spec documents under `docs/superpowers`.
- Static assets unless they become unreachable as part of removed code paths.

## Source Of Truth

The production app is defined by:
- `src/app/**`
- active shared runtime components imported by `src/app/**`
- the current docs content trees under `src/docs/**` and `src/zhCN-docs/**`
- active build/config entrypoints such as `next.config.ts`, `package.json`, `tsconfig.json`, and the current test entrypoints

Anything outside that set is a deletion candidate unless it is still imported by the current runtime or build.

## Cleanup Strategy

### 1. Remove legacy routing systems

Delete the old Pages Router code and related route-era files now superseded by the App Router:
- `src/pages/**`
- `src/pages-legacy/**`
- route-specific support code that only existed for the old page architecture

The repository should no longer carry a second routing system after this pass.

### 2. Remove obsolete configuration and bootstrap code

Delete configuration and bootstrap files that belonged to the old stack and are no longer part of the current build:
- old Next.js config variants replaced by `next.config.ts`
- old JS config/bootstrap files replaced by current TypeScript or App Router setup
- old app/document bootstrap files tied to the Pages Router

If a config file is still consumed by the current toolchain, it stays. Otherwise it is removed, not preserved for history.

### 3. Remove duplicate component/runtime implementations

Where the repository contains both old and new implementations of the same runtime concern, keep only the version used by the live app. Typical examples include:
- old `*.js` component variants superseded by active `*.tsx` runtime files
- legacy docs/home/header/footer/navigation implementations no longer imported by `src/app/**`
- old layout wrappers that are no longer part of the App Router render tree

The rule is import-based: the file used by the current runtime survives; the stale twin is deleted.

### 4. Remove dead helper and compatibility code

Delete helper modules, layouts, and adapters that survived only to support the old site or partial migration states, including:
- compatibility glue for the removed routing system
- dead docs/layout helpers no longer referenced by the current docs shell
- unused migration-only code paths

If removal breaks an import or stale reference, fix the reference in the same change rather than backing out the cleanup.

## Non-Goals

- No homepage redesign or feature work.
- No docs content rewrite beyond what is needed to remove broken references.
- No asset pruning campaign across the whole repo.
- No attempt to preserve old architecture for fallback use.

## Verification Requirements

The cleanup is only acceptable if all of the following pass after deletion:

1. `node --test tests/docs-migration.test.mjs`
2. `pnpm build`
3. Fresh local export server serves key routes successfully:
   - `/`
   - `/docs`
   - `/docs/start/what-is-apihug`
   - `/zhCN-docs`

In addition, any stale import, menu entry, route reference, or test expectation exposed by the purge must be fixed before completion is claimed.

## Risks And Controls

### Risk: deleting code still used indirectly
Control: use the current App Router build path as the anchor and verify with tests plus full build.

### Risk: duplicate components with ambiguous ownership
Control: resolve by checking actual imports from `src/app/**` and active runtime entrypoints, not by filename similarity.

### Risk: cleanup leaves broken references behind
Control: cleanup includes fixing broken imports and references in the same pass.

## Expected Outcome

After this cleanup:
- the repo contains one production web architecture instead of old and new site stacks side by side
- dead route/config/component code is removed
- the current homepage and both docs locales still build and run
- future production work happens against a narrower, cleaner codebase
