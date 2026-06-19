import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const sourceExtensions = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".mdx"];

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

function normalizeRelative(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
}

function isSourceFile(filePath) {
  return sourceExtensions.includes(path.extname(filePath));
}

function extractLocalImports(source) {
  const imports = new Set();
  const patterns = [
    /\bimport\s+[^'"]*?\sfrom\s*["']([^"']+)["']/g,
    /\bexport\s+[^'"]*?\sfrom\s*["']([^"']+)["']/g,
    /\bimport\s*["']([^"']+)["']/g,
  ];

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      const specifier = match[1];
      if (specifier.startsWith("@/") || specifier.startsWith("./") || specifier.startsWith("../")) {
        imports.add(specifier);
      }
    }
  }

  return [...imports];
}

function resolveLocalImport(fromPath, specifier) {
  const basePath = specifier.startsWith("@/")
    ? path.join(repoRoot, "src", specifier.slice(2))
    : path.resolve(path.dirname(fromPath), specifier);
  const candidates = [
    basePath,
    ...sourceExtensions.map((ext) => `${basePath}${ext}`),
    ...sourceExtensions.map((ext) => path.join(basePath, `index${ext}`)),
  ];

  for (const candidate of candidates) {
    if (!fs.existsSync(candidate) || !isSourceFile(candidate)) {
      continue;
    }

    const normalized = path.normalize(candidate);
    if (
      normalized === path.join(repoRoot, "mdx-components.tsx") ||
      normalized.startsWith(path.join(repoRoot, "src") + path.sep)
    ) {
      return normalized;
    }
  }

  return null;
}

function getReachableProductionFiles() {
  const roots = [
    ...listFiles(path.join(repoRoot, "src", "app")).filter(isSourceFile),
    path.join(repoRoot, "mdx-components.tsx"),
  ];
  const reachable = new Set();
  const queue = [...roots];

  while (queue.length > 0) {
    const filePath = queue.shift();
    if (reachable.has(filePath)) {
      continue;
    }

    reachable.add(filePath);

    const source = fs.readFileSync(filePath, "utf8");
    for (const specifier of extractLocalImports(source)) {
      const resolved = resolveLocalImport(filePath, specifier);
      if (resolved && !reachable.has(resolved)) {
        queue.push(resolved);
      }
    }
  }

  return reachable;
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
  const productionSurface = getReachableProductionFiles();

  for (const relPath of [
    "src/components/icon-button.tsx",
    "src/components/logo.tsx",
    "src/components/nav-list.tsx",
    "src/components/docs-sidebar-link.tsx",
  ]) {
    assert.ok(productionSurface.has(path.join(repoRoot, ...relPath.split("/"))), relPath);
  }

  const staleImports = [...productionSurface]
    .flatMap((filePath) => {
      const source = fs.readFileSync(filePath, "utf8");
      return staleImportPrefixes
        .filter((prefix) => source.includes(prefix))
        .map((prefix) => `${normalizeRelative(filePath)} -> ${prefix}`);
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

test("legacy duplicate components and home demo layer are removed", () => {
  for (const relPath of [
    "src/components/ArbitraryValues",
    "src/components/BreakpointsAndMediaQueries",
    "src/components/CustomizePluginColors",
    "src/components/DynamicViewportHeights",
    "src/components/Guides",
    "src/components/HardwareAcceleration",
    "src/components/HoverFocusAndOtherStates",
    "src/components/MultiCursorDemo",
    "src/components/RemovingBackdropFilters",
    "src/components/RemovingFilters",
    "src/components/RemovingTransforms",
    "src/components/Button.js",
    "src/components/ClassTable.js",
    "src/components/Code.js",
    "src/components/CodeWindow.js",
    "src/components/ColorPalette.js",
    "src/components/ColorPaletteReference.js",
    "src/components/ConfigSample.js",
    "src/components/CorePluginReference.js",
    "src/components/Cta.js",
    "src/components/DarkModeSwitch.js",
    "src/components/DocsFooter.js",
    "src/components/Editor.js",
    "src/components/Example.js",
    "src/components/Footer.js",
    "src/components/GridLockup.js",
    "src/components/GridLockup.module.css",
    "src/components/Header.js",
    "src/components/Heading.js",
    "src/components/HeadlessUIV2Examples.js",
    "src/components/HtmlZenGarden.js",
    "src/components/List.js",
    "src/components/Lockup.js",
    "src/components/Logo.js",
    "src/components/Meta.js",
    "src/components/NewsletterForm.js",
    "src/components/PageHeader.js",
    "src/components/PostItem.js",
    "src/components/Search.js",
    "src/components/SpacingScale.js",
    "src/components/Steps.js",
    "src/components/TabBar.js",
    "src/components/Tabs.js",
    "src/components/Testimonials.js",
    "src/components/ThemeReference.js",
    "src/components/ThemeToggle.js",
    "src/components/TuiBanner.js",
    "src/components/VersionSwitcher.js",
    "src/components/Widont.js",
    "src/components/home/BuildAnything.js",
    "src/components/home/ComponentDriven.js",
    "src/components/home/ConstraintBased.js",
    "src/components/home/Customization.js",
    "src/components/home/DarkMode.js",
    "src/components/home/EditorTools.js",
    "src/components/home/Footer.js",
    "src/components/home/Hero.js",
    "src/components/home/MobileFirst.js",
    "src/components/home/ModernFeatures.js",
    "src/components/home/Performance.js",
    "src/components/home/ReadyMadeComponents.js",
    "src/components/home/StateVariants.js",
    "src/components/home/common.js",
    "src/components/home/zhCN",
  ]) {
    assert.equal(exists(...relPath.split("/")), false, relPath);
  }
});
