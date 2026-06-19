import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();

function exists(...segments) {
  return fs.existsSync(path.join(repoRoot, ...segments));
}

function read(...segments) {
  return fs.readFileSync(path.join(repoRoot, ...segments), "utf8");
}

test("pages router leftovers and old bootstrap configs are removed", () => {
  for (const relPath of [
    ["src", "pages"],
    ["src", "pages-legacy"],
    ["jsconfig.json"],
    ["next.config.mjs"],
    ["postcss.config.js"],
    ["prettier.config.js"],
    ["tailwind.config.js"],
  ]) {
    assert.equal(exists(...relPath), false, relPath.join("/"));
  }
});

test("app router entrypoints still point at the active runtime", () => {
  const homePage = read("src", "app", "page.tsx");
  const rootLayout = read("src", "app", "layout.tsx");
  const docsLayout = read("src", "app", "(docs)", "layout.tsx");

  assert.match(homePage, /@\/components\/header/);
  assert.match(homePage, /@\/components\/footer/);
  assert.match(homePage, /@\/components\/home\/hero/);

  assert.match(rootLayout, /@\/components\/search/);
  assert.match(rootLayout, /@\/components\/theme-toggle/);

  assert.match(docsLayout, /@\/components\/header/);
  assert.match(docsLayout, /@\/components\/footer/);
  assert.match(docsLayout, /@\/components\/mobile-docs-nav/);
  assert.match(docsLayout, /@\/components\/docs-sidebar/);
});
