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

function listMdxFiles(dirPath) {
  return listFiles(dirPath).filter((filePath) => filePath.endsWith(".mdx"));
}

function routeFromAppPage(filePath) {
  const relPath = normalizeRelative(filePath);
  if (relPath === "src/app/page.tsx") {
    return "/";
  }

  const relDir = relPath.replace(/^src\/app\//, "").replace(/\/page\.tsx$/, "");
  const segments = relDir
    .split("/")
    .filter(Boolean)
    .filter((segment) => !segment.startsWith("(") && !segment.startsWith("@"));

  if (segments.some((segment) => segment.includes("["))) {
    return null;
  }

  return segments.length === 0 ? "/" : `/${segments.join("/")}`;
}

function routeFromDocsFile(filePath, prefix) {
  const relativePath = path.relative(path.join(repoRoot, "src", prefix === "/docs" ? "docs" : "zhCN-docs"), filePath);
  const routeSegments = relativePath
    .replace(/\.mdx$/, "")
    .split(path.sep)
    .filter(Boolean);

  if (routeSegments[routeSegments.length - 1] === "index") {
    routeSegments.pop();
  }

  return routeSegments.length === 0 ? prefix : `${prefix}/${routeSegments.join("/")}`;
}

function getValidInternalTargets() {
  const validRoutes = new Set(
    listFiles(path.join(repoRoot, "src", "app"))
      .filter((filePath) => filePath.endsWith("page.tsx"))
      .map(routeFromAppPage)
      .filter(Boolean),
  );

  for (const filePath of listMdxFiles(path.join(repoRoot, "src", "docs"))) {
    validRoutes.add(routeFromDocsFile(filePath, "/docs"));
  }

  for (const filePath of listMdxFiles(path.join(repoRoot, "src", "zhCN-docs"))) {
    validRoutes.add(routeFromDocsFile(filePath, "/zhCN-docs"));
  }

  const validAssets = new Set(
    listFiles(path.join(repoRoot, "public")).map((filePath) => `/${path.relative(path.join(repoRoot, "public"), filePath).split(path.sep).join("/")}`),
  );

  return { validRoutes, validAssets };
}

function normalizeInternalHref(href) {
  if (!href || !href.startsWith("/")) {
    return null;
  }

  const [withoutHash] = href.split("#");
  const [pathname] = withoutHash.split("?");
  return pathname || "/";
}

function normalizeSourceRelativePath(targetPath) {
  const relativeToSrc = path.relative(path.join(repoRoot, "src"), targetPath).split(path.sep).join("/");
  if (relativeToSrc.startsWith("..")) {
    return null;
  }

  const withoutExtension = relativeToSrc.replace(/\.(md|mdx|ts|tsx|js|jsx|mjs)$/, "");
  return withoutExtension.endsWith("/index")
    ? `/${withoutExtension.slice(0, -"/index".length)}`
    : `/${withoutExtension}`;
}

function resolveRelativeDocHref(filePath, href) {
  if (!/\.(md|mdx)$/i.test(filePath) || !href || href.startsWith("#")) {
    return null;
  }

  const [withoutHash] = href.split("#");
  const [pathname] = withoutHash.split("?");
  const resolvedPath = path.resolve(path.dirname(filePath), pathname);

  if (resolvedPath.startsWith(path.join(repoRoot, "src", "docs") + path.sep)) {
    return routeFromDocsFile(resolvedPath.replace(/\.(md|mdx)$/i, ".mdx"), "/docs");
  }

  if (resolvedPath.startsWith(path.join(repoRoot, "src", "zhCN-docs") + path.sep)) {
    return routeFromDocsFile(resolvedPath.replace(/\.(md|mdx)$/i, ".mdx"), "/zhCN-docs");
  }

  return normalizeSourceRelativePath(resolvedPath);
}

function collectInternalLinksFromSource(source, filePath) {
  const links = new Set();
  const patterns = [
    /\bhref\s*=\s*["'](\/[^"'#)\s}]*)[^"']*["']/g,
    /\bhref\s*=\s*\{["'](\/[^"'#)\s}]*)[^"']*["']\}/g,
    /\]\((\/[^)#\s]+(?:#[^)]+)?)\)/g,
  ];
  const relativeMarkdownLinkPattern = /\]\(((?:\.\.?\/)[^)#\s]+(?:#[^)]+)?)\)/g;

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      const normalized = normalizeInternalHref(match[1]);
      if (normalized) {
        links.add(normalized);
      }
    }
  }

  for (const match of source.matchAll(relativeMarkdownLinkPattern)) {
    const normalized = resolveRelativeDocHref(filePath, match[1]);
    if (normalized) {
      links.add(normalized);
    }
  }

  const relativePath = normalizeRelative(filePath);
  if (
    relativePath === "src/app/(docs)/docs/index.tsx" ||
    relativePath === "src/app/(docs)/zhCN-docs/index.tsx"
  ) {
    for (const match of source.matchAll(/\[\s*"[^"]+",\s*"([^"]+)"/g)) {
      const normalized = normalizeInternalHref(match[1]);
      if (normalized) {
        links.add(normalized);
      }
    }
  }

  return [...links];
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
  assert.doesNotMatch(rootLayout, /@\/components\/theme-toggle/);
  assert.doesNotMatch(rootLayout, /currentTheme|_updateTheme|darkModeScript/);

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

test("tooling does not keep stale npm lockfiles or dead direct MDX helpers", () => {
  const packageJson = JSON.parse(read("package.json"));

  assert.equal(exists("package-lock.json"), false, "package-lock.json");
  assert.equal(packageJson.devDependencies?.["hast-util-to-jsx-runtime"], undefined);
});

test("light-only runtime removes the theme toggle component", () => {
  const footer = read("src", "components", "footer.tsx");
  const packageJson = JSON.parse(read("package.json"));

  assert.equal(exists("src", "components", "theme-toggle.tsx"), false, "src/components/theme-toggle.tsx");
  assert.doesNotMatch(footer, /ThemeToggle/);
  assert.equal(packageJson.dependencies?.["@headlessui/react"] !== undefined, true);
});

test("legacy blog-only helpers are removed", () => {
  for (const relPath of [
    "src/scripts/build-rss.js",
    "src/utils/getAllPosts.js",
  ]) {
    assert.equal(exists(...relPath.split("/")), false, relPath);
  }
});

test("active internal links resolve to real routes or static assets", () => {
  const sourceFiles = [
    ...listFiles(path.join(repoRoot, "src", "app")).filter((filePath) => isSourceFile(filePath)),
    ...listFiles(path.join(repoRoot, "src", "components")).filter((filePath) => isSourceFile(filePath)),
    ...listMdxFiles(path.join(repoRoot, "src", "docs")),
    ...listMdxFiles(path.join(repoRoot, "src", "zhCN-docs")),
    path.join(repoRoot, "mdx-components.tsx"),
  ];
  const { validRoutes, validAssets } = getValidInternalTargets();

  const brokenLinks = sourceFiles.flatMap((filePath) => {
    const source = fs.readFileSync(filePath, "utf8");
    return collectInternalLinksFromSource(source, filePath)
      .filter((href) => !validRoutes.has(href) && !validAssets.has(href))
      .map((href) => `${normalizeRelative(filePath)} -> ${href}`);
  });

  assert.deepEqual(brokenLinks, [], brokenLinks.join("\n"));
});

test("github pages workflow matches the current pnpm static export pipeline", () => {
  const workflow = read(".github", "workflows", "nextjs.yml");

  assert.match(workflow, /uses:\s*pnpm\/action-setup@v4/);
  assert.match(workflow, /cache:\s*pnpm/);
  assert.match(workflow, /hashFiles\('\*\*\/pnpm-lock\.yaml'\)/);
  assert.match(workflow, /run:\s*pnpm install --frozen-lockfile/);
  assert.match(workflow, /run:\s*pnpm build/);
  assert.doesNotMatch(workflow, /Detect package manager/);
  assert.doesNotMatch(workflow, /manager=npm/);
  assert.doesNotMatch(workflow, /npm ci/);
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

test("live snippet group does not depend on deleted editor infrastructure", () => {
  const snippetGroup = read("src", "components", "SnippetGroup.js");

  assert.doesNotMatch(snippetGroup, /@\/components\/Editor/);
  assert.doesNotMatch(snippetGroup, /\bFrame\b\s+from/);
});
