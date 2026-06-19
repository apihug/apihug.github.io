# Docs Locale Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expose both English and Chinese docs from the top header, with `Docs` acting as the desktop locale chooser and all stale Chinese header links normalized to `/zhCN-docs`.

**Architecture:** Keep the change local to the existing legacy header component in `src/components/Header.js`. Add one regression in `tests/docs-migration.test.mjs` first, then implement a compact desktop docs menu plus explicit mobile links, and finish by verifying the header source, tests, and build output.

**Tech Stack:** Next.js, React, existing `@headlessui/react` dialog usage, Node test runner, plain source-level regex assertions.

---

## File Structure

- `src/components/Header.js`
  - Owns the current site header, desktop nav, mobile popover nav, and the stale Chinese badge/nav links that still point at legacy routes.
- `tests/docs-migration.test.mjs`
  - Houses source-level regression tests for docs migration behavior and is the right place to lock the new header locale-menu targets.
- `docs/superpowers/specs/2026-06-19-docs-locale-menu-design.md`
  - Approved design reference for this work. Do not modify during implementation.

### Task 1: Lock the Header Locale-Menu Contract in Tests

**Files:**
- Modify: `tests/docs-migration.test.mjs`
- Reference: `src/components/Header.js`

- [ ] **Step 1: Write the failing test**

Add this test near the existing routing/header-oriented regressions in `tests/docs-migration.test.mjs`:

```js
test("header exposes english and zhCN docs entry points", () => {
  const header = fs.readFileSync(path.join(repoRoot, "src", "components", "Header.js"), "utf8");

  assert.match(header, /English Docs/);
  assert.match(header, /中文文档|涓枃鏂囨。/);
  assert.match(header, /href="\/zhCN-docs"|href='\/zhCN-docs'|href=\{["']\/zhCN-docs["']\}/);
  assert.match(header, /href="\/docs"|href='\/docs'|href=\{["']\/docs["']\}/);
  assert.doesNotMatch(header, /\/zhCN-docs\/start\.html/);
  assert.doesNotMatch(header, /href="\/zhCN"|href='\/zhCN'|href=\{["']\/zhCN["']\}/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/docs-migration.test.mjs
```

Expected: `FAIL` on the new `header exposes english and zhCN docs entry points` test because `src/components/Header.js` still contains `/zhCN-docs/start.html`, still contains `/zhCN`, and does not yet expose `English Docs` plus `中文文档` as docs-locale targets.

- [ ] **Step 3: Commit the failing test**

```bash
git add tests/docs-migration.test.mjs
git commit -m "test: lock header docs locale menu targets"
```

### Task 2: Implement the Desktop Docs Locale Menu and Normalize Chinese Header Links

**Files:**
- Modify: `src/components/Header.js`
- Test: `tests/docs-migration.test.mjs`

- [ ] **Step 1: Add a focused desktop docs menu helper**

Inside `src/components/Header.js`, add a small helper component above `NavItems` so the desktop locale picker is isolated instead of being inlined into the large `Header` body:

```js
function DocsMenu() {
  let [isOpen, setIsOpen] = useState(false)

  return (
    <li
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        className="inline-flex items-center gap-1 hover:text-sky-500 dark:hover:text-sky-400"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        Docs
        <svg width="8" height="6" aria-hidden="true" className={clsx('transition-transform', isOpen && 'rotate-180')}>
          <path
            d="M1 1l3 3 3-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full mt-3 w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-800">
          <div className="flex flex-col text-sm font-semibold text-slate-700 dark:text-slate-200">
            <Link href="/docs" className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700">
              English Docs
            </Link>
            <Link href="/zhCN-docs" className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700">
              中文文档
            </Link>
          </div>
        </div>
      )}
    </li>
  )
}
```

- [ ] **Step 2: Replace the old single docs link and stale Chinese links**

Update `Featured2` and `NavItems` in `src/components/Header.js` so the header points at the migrated Chinese docs entry and mobile nav exposes both locale links explicitly:

```js
function Featured2() {
  return (
    <a
      href="/zhCN-docs"
      className="ml-3 text-xs leading-5 font-medium text-sky-600 dark:text-sky-400 bg-sky-400/10 rounded-full py-1 px-3 hidden xl:flex items-center hover:bg-sky-400/20"
    >
      <strong className="font-semibold">中文</strong>
      ...
      <span className="ml-2">文档</span>
      ...
    </a>
  )
}

export function NavItems({ mobile = false }) {
  return (
    <>
      {mobile ? (
        <>
          <li>
            <Link href="/docs" className="hover:text-sky-500 dark:hover:text-sky-400">
              English Docs
            </Link>
          </li>
          <li>
            <Link href="/zhCN-docs" className="hover:text-sky-500 dark:hover:text-sky-400" title="中文文档">
              中文文档
            </Link>
          </li>
        </>
      ) : (
        <DocsMenu />
      )}
      <li>
        <Link href="/docs/idea" className="hover:text-sky-500 dark:hover:text-sky-400" title={'IDEA Plugin'}>
          Editor
        </Link>
      </li>
      ...
    </>
  )
}
```

Then update the two call sites so the popover gets flat links and desktop keeps the dropdown:

```js
<ul className="space-y-6">
  <NavItems mobile />
  ...
</ul>
```

```js
<ul className="flex space-x-8">
  <NavItems />
</ul>
```

- [ ] **Step 3: Run tests to verify the new contract passes**

Run:

```bash
node --test tests/docs-migration.test.mjs
```

Expected: `PASS`, including the new header locale-menu regression.

- [ ] **Step 4: Commit the implementation**

```bash
git add src/components/Header.js tests/docs-migration.test.mjs
git commit -m "feat: expose zhCN docs in header menu"
```

### Task 3: Verify Build and Manual Header Behavior

**Files:**
- Verify: `src/components/Header.js`
- Verify: `tests/docs-migration.test.mjs`

- [ ] **Step 1: Run the build**

Run:

```bash
pnpm build
```

Expected: `PASS` with the app building successfully and no header-related compile errors from the new dropdown state, JSX, or link changes.

- [ ] **Step 2: Manually verify the header behavior**

Run a local server for the current build/dev instance and check these behaviors in the browser:

```text
Desktop:
- top nav shows a Docs trigger
- Docs reveals English Docs -> /docs
- Docs reveals 中文文档 -> /zhCN-docs
- the featured Chinese badge links to /zhCN-docs

Mobile:
- the popover shows English Docs
- the popover shows 中文文档
- no header link points to /zhCN or /zhCN-docs/start.html
```

- [ ] **Step 3: Commit any final verification-only adjustments if needed**

If no code changes were needed after manual verification, skip this step. If a small follow-up tweak was required, commit it separately:

```bash
git add src/components/Header.js tests/docs-migration.test.mjs
git commit -m "fix: polish header docs locale menu"
```

## Self-Review

- Spec coverage:
  - Desktop `Docs` locale chooser is covered by Task 2.
  - Mobile flat English/Chinese links are covered by Task 2.
  - Stale `/zhCN-docs/start.html` and `/zhCN` header links are removed by Task 2 and locked by Task 1.
  - Verification is covered by Task 3.
- Placeholder scan:
  - No `TODO`, `TBD`, or “similar to previous task” placeholders remain.
- Type and interface consistency:
  - `NavItems({ mobile = false })` is introduced once and used consistently at both call sites.
  - Locale link targets are consistently `/docs` and `/zhCN-docs`.
