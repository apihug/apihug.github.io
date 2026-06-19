import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const docsRoot = path.join(repoRoot, "src", "docs");

function walkMdxFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return walkMdxFiles(fullPath);
    }
    return entry.name.endsWith(".mdx") ? [fullPath] : [];
  });
}

test("docs pages use a dedicated prose styling hook", () => {
  const docPage = fs.readFileSync(
    path.join(repoRoot, "src", "app", "(docs)", "docs", "[...slug]", "page.tsx"),
    "utf8",
  );
  const globalStyles = fs.readFileSync(path.join(repoRoot, "src", "app", "globals.css"), "utf8");
  const typographyStyles = fs.readFileSync(path.join(repoRoot, "src", "app", "typography.css"), "utf8");

  assert.match(docPage, /className="prose mt-10"/);
  assert.match(globalStyles, /@import "\.\/typography\.css" layer\(components\);/);
  assert.match(typographyStyles, /^\.prose\s*\{/m);
  assert.match(typographyStyles, /h2:where/);
});

test("docs MDX pipeline supports GFM tables and constrained code blocks", () => {
  const nextConfig = fs.readFileSync(path.join(repoRoot, "next.config.ts"), "utf8");
  const typographyStyles = fs.readFileSync(path.join(repoRoot, "src", "app", "typography.css"), "utf8");
  const startDoc = fs.readFileSync(path.join(docsRoot, "start", "index.mdx"), "utf8");
  const snippetGroup = fs.readFileSync(path.join(repoRoot, "src", "components", "SnippetGroup.js"), "utf8");
  const docsCodeBlock = fs.readFileSync(path.join(repoRoot, "src", "components", "DocsCodeBlock.tsx"), "utf8");
  const copyButton = fs.readFileSync(path.join(repoRoot, "src", "components", "CodeCopyButton.tsx"), "utf8");
  const docsStartResources = fs.readFileSync(
    path.join(repoRoot, "src", "components", "DocsStartResources.tsx"),
    "utf8",
  );

  assert.match(nextConfig, /remarkPlugins:\s*\[\s*\[\s*"remark-gfm"/);
  assert.match(typographyStyles, /pre:where[\s\S]*overflow-x:\s*auto;/);
  assert.match(snippetGroup, /React\.Children\.toArray/);
  assert.match(snippetGroup, /CodeCopyButton/);
  assert.match(snippetGroup, /tabs\[selectedIndex\]\?\.props\.code/);
  assert.match(snippetGroup, /\{child\.props\.children\}/);
  assert.match(snippetGroup, /flex h-10 flex-auto items-center justify-end[\s\S]*px-2/);
  assert.doesNotMatch(snippetGroup, /dangerouslySetInnerHTML/);
  assert.match(docsCodeBlock, /CodeCopyButton/);
  assert.match(docsCodeBlock, /flex h-10 items-center justify-end border-b/);
  assert.match(copyButton, /navigator\.clipboard\.writeText/);
  assert.doesNotMatch(copyButton, /\bborder\b/);
  assert.doesNotMatch(startDoc, /\{\{\s*filename\s*:/);
  assert.match(startDoc, /<div[\s\S]*filename="libs\.versions\.toml"[\s\S]*code=\{/);
  assert.match(startDoc, /DocsMavenCentralBadge/);
  assert.match(startDoc, /DocsJetBrainsMarketplaceCard/);
  assert.match(docsStartResources, /href="https:\/\/search\.maven\.org\/artifact\/com\.apihug\/it-bom"/);
  assert.match(docsStartResources, /target="_blank"/);
  assert.match(docsStartResources, /img\.shields\.io\/maven-central\/v\/com\.apihug\/it-bom\.svg\?label=Maven%20Central/);
  assert.match(docsStartResources, /plugins\.jetbrains\.com\/embeddable\/card\/23534/);
  assert.match(docsStartResources, /frameBorder="0"|style=\{\{\s*border:\s*0\s*\}\}/);
  assert.match(docsStartResources, /height="319px"/);
  assert.match(docsStartResources, /width="384px"/);
  assert.match(docsStartResources, /allowFullScreen/);
  assert.doesNotMatch(docsStartResources, /rounded-xl|shadow-sm|max-w-\[384px\]|w-full/);
});

test("docs code blocks expose Tailwind-style chrome", () => {
  const snippetGroup = fs.readFileSync(path.join(repoRoot, "src", "components", "SnippetGroup.js"), "utf8");
  const docsCodeBlock = fs.readFileSync(path.join(repoRoot, "src", "components", "DocsCodeBlock.tsx"), "utf8");
  const copyButton = fs.readFileSync(path.join(repoRoot, "src", "components", "CodeCopyButton.tsx"), "utf8");

  assert.match(docsCodeBlock, /const LANGUAGE_LABELS =/);
  assert.match(docsCodeBlock, /getCodeBlockLabel\(className\)/);
  assert.match(docsCodeBlock, /items-center justify-between/);
  assert.match(docsCodeBlock, /<span[^>]*>\{label\}<\/span>/);

  assert.match(copyButton, /aria-label=\{copied \? "Copied code" : "Copy code"\}/);
  assert.match(copyButton, /title=\{copied \? "Copied" : "Copy"\}/);
  assert.doesNotMatch(copyButton, /<span>\{copied \? "Copied" : "Copy"\}<\/span>/);

  assert.match(snippetGroup, /const activeLabel = tabs\[selectedIndex\]\?\.props\.filename \|\| 'Code'/);
  assert.match(snippetGroup, /items-center justify-between/);
  assert.match(snippetGroup, /CodeCopyButton value=\{activeCode\}/);
});

test("migrated docs no longer contain YAML frontmatter blocks", () => {
  const frontmatterFiles = walkMdxFiles(docsRoot)
    .filter((filePath) => fs.readFileSync(filePath, "utf8").startsWith("---"))
    .map((filePath) => path.relative(repoRoot, filePath));

  assert.deepEqual(frontmatterFiles, []);
});

test("migrated docs no longer contain legacy badge and iframe embeds", () => {
  const legacyHtmlFiles = walkMdxFiles(docsRoot)
    .filter((filePath) => {
      const source = fs.readFileSync(filePath, "utf8");
      return (
        source.includes("<iframe") ||
        source.includes("img.shields.io") ||
        source.includes("plugins.jetbrains.com/embeddable")
      );
    })
    .map((filePath) => path.relative(repoRoot, filePath));

  assert.deepEqual(legacyHtmlFiles, []);
});

test("docs nav includes the remaining milestone and changelog detail pages", () => {
  const navIndex = fs.readFileSync(
    path.join(repoRoot, "src", "app", "(docs)", "docs", "index.tsx"),
    "utf8",
  );

  for (const route of [
    "/docs/milestone/milestone-1.0.0-RELEASE",
    "/docs/changelog/detail/SDK_0.8.6",
    "/docs/changelog/detail/SDK_0.7.8",
  ]) {
    assert.match(navIndex, new RegExp(route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("zhCN docs nav includes the expected changelog, kola, and milestone routes", () => {
  const zhNavIndex = fs.readFileSync(
    path.join(repoRoot, "src", "app", "(docs)", "zhCN-docs", "index.tsx"),
    "utf8",
  );

  for (const route of [
    "/zhCN-docs/changelog/detail/SDK_0.7.8",
    "/zhCN-docs/changelog/detail/SDK_0.7.8_cn",
    "/zhCN-docs/changelog/detail/SDK_0.8.6",
    "/zhCN-docs/changelog/detail/SDK_0.8.6_cn",
    "/zhCN-docs/kola/006_configurations",
    "/zhCN-docs/milestone/milestone-1.0.0-RELEASE",
  ]) {
    assert.match(zhNavIndex, new RegExp(route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("english docs do not link to untranslated changelog detail routes", () => {
  const untranslatedLinks = walkMdxFiles(docsRoot)
    .filter((filePath) => fs.readFileSync(filePath, "utf8").includes("/docs/changelog/detail/SDK_0."))
    .flatMap((filePath) => {
      const matches = fs
        .readFileSync(filePath, "utf8")
        .match(/\/docs\/changelog\/detail\/SDK_[^)\s"'`]*_cn/g);

      return matches ? [path.relative(repoRoot, filePath)] : [];
    });

  assert.deepEqual(untranslatedLinks, []);
});

test("protobuf extension docs stay aligned with the current it-proto-extend surface", () => {
  const protoOption = fs.readFileSync(path.join(docsRoot, "protobuf", "proto-option.mdx"), "utf8");
  const protoEntity = fs.readFileSync(path.join(docsRoot, "protobuf", "proto-entity.mdx"), "utf8");
  const swaggerSpec = fs.readFileSync(path.join(docsRoot, "spec", "swagger.mdx"), "utf8");
  const domainSpec = fs.readFileSync(path.join(docsRoot, "spec", "domain.mdx"), "utf8");
  const constantSpec = fs.readFileSync(path.join(docsRoot, "spec", "constant.mdx"), "utf8");
  const versionSpec = fs.readFileSync(path.join(docsRoot, "spec", "version.mdx"), "utf8");
  const specIndex = fs.readFileSync(path.join(docsRoot, "spec", "index.mdx"), "utf8");
  const navIndex = fs.readFileSync(
    path.join(repoRoot, "src", "app", "(docs)", "docs", "index.tsx"),
    "utf8",
  );

  assert.match(protoOption, /hope\.swagger\.operation/);
  assert.match(protoOption, /hope\.swagger\.svc/);
  assert.match(protoOption, /hope\.persistence\.table/);
  assert.match(protoOption, /hope\.persistence\.column/);
  assert.match(protoOption, /hope\.constant\.field/);
  assert.match(protoOption, /hope\.version/);
  assert.match(protoOption, /31142/);
  assert.doesNotMatch(protoOption, /google\.api\.http/);

  assert.doesNotMatch(protoEntity, /length:\s*\{/);
  assert.doesNotMatch(protoEntity, /\bFALSE\b|\bTRUE\b/);
  assert.match(protoEntity, /nullable:\s*false/);

  assert.match(swaggerSpec, /is_repeated/);
  assert.match(swaggerSpec, /APPLICATION_ZIP/);
  assert.doesNotMatch(swaggerSpec, /\| `plural` \| bool \| Is array \|/);

  assert.doesNotMatch(domainSpec, /extend\/common\.proto/);
  assert.match(domainSpec, /TIME_WITH_TIMEZONE/);
  assert.match(domainSpec, /TIMESTAMP_WITH_TIMEZONE/);
  assert.match(domainSpec, /ROWID/);

  assert.match(constantSpec, /NOT_ACCEPTABLE/);
  assert.match(constantSpec, /NETWORK_AUTHENTICATION_REQUIRED/);

  assert.match(versionSpec, /deprecated/i);
  assert.match(versionSpec, /31142/);
  assert.match(versionSpec, /31143/);
  assert.match(specIndex, /\/docs\/spec\/version/);
  assert.match(navIndex, /\/docs\/spec\/version/);
});

test("docs index route redirects to what-is-apihug", () => {
  const docsIndexPage = fs.readFileSync(
    path.join(repoRoot, "src", "app", "(docs)", "docs", "page.tsx"),
    "utf8",
  );

  assert.match(docsIndexPage, /permanentRedirect/);
  assert.match(docsIndexPage, /\/docs\/start\/what-is-apihug/);
});

test("pagination supports both english and zhCN docs trees", () => {
  const pagination = fs.readFileSync(path.join(repoRoot, "src", "components", "pagination.tsx"), "utf8");

  assert.doesNotMatch(pagination, /import index from "..\/app\/\(docs\)\/docs\/index"/);
  assert.match(pagination, /currentPath/);
  assert.match(pagination, /navIndex/);
});
test("zhCN docs index route redirects to what-is-apihug", () => {
  const zhDocsIndexPage = fs.readFileSync(
    path.join(repoRoot, "src", "app", "(docs)", "zhCN-docs", "page.tsx"),
    "utf8",
  );

  assert.match(zhDocsIndexPage, /permanentRedirect/);
  assert.match(zhDocsIndexPage, /\/zhCN-docs\/start\/what-is-apihug/);
});
