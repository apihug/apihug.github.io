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

function listFiles(dirPath) {
  const files = [];
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(entryPath));
      continue;
    }
    files.push(entryPath);
  }
  return files.sort();
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

test("legacy layout, nav, and hook infrastructure is removed", () => {
  for (const relPath of [
    ["src", "layouts"],
    ["src", "navs"],
    ["src", "hooks"],
  ]) {
    assert.equal(exists(...relPath), false, relPath.join("/"));
  }

  const staleImportPrefixes = ["@/layouts/", "@/navs/", "@/hooks/"];
  const staleImports = listFiles(path.join(repoRoot, "src"))
    .filter((filePath) => [".js", ".jsx", ".ts", ".tsx", ".mjs", ".mdx"].includes(path.extname(filePath)))
    .flatMap((filePath) => {
      const source = fs.readFileSync(filePath, "utf8");
      return staleImportPrefixes
        .filter((prefix) => source.includes(prefix))
        .map((prefix) => `${path.relative(repoRoot, filePath).split(path.sep).join("/")} -> ${prefix}`);
    });

  assert.deepEqual(staleImports, [], staleImports.join("\n"));
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

test("tooling no longer carries pages-legacy default paths", () => {
  const convertMdxScript = read("scripts", "convert-mdx.mjs");

  assert.doesNotMatch(convertMdxScript, /src\/pages-legacy/);
  assert.match(convertMdxScript, /Usage: node scripts\/convert-mdx\.mjs <source-root> \[target-root\]/);
});
