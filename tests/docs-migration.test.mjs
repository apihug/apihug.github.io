import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const docsRoot = path.join(repoRoot, "src", "docs");
const zhDocsRoot = path.join(repoRoot, "src", "zhCN-docs");

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
  assert.match(snippetGroup, /flex items-center justify-between border-b[\s\S]*px-2 py-2/);
  assert.doesNotMatch(snippetGroup, /dangerouslySetInnerHTML/);
  assert.match(docsCodeBlock, /CodeCopyButton/);
  assert.match(docsCodeBlock, /flex items-center justify-between border-b[\s\S]*px-4 py-2/);
  assert.match(copyButton, /navigator\.clipboard\.writeText/);
  assert.doesNotMatch(copyButton, /\bborder\b/);
  assert.doesNotMatch(startDoc, /\{\{\s*filename\s*:/);
  assert.match(startDoc, /<div[\s\S]*filename="libs\.versions\.toml"[\s\S]*code=\{/);
  assert.match(startDoc, /DocsMavenCentralBadge/);
  assert.match(startDoc, /DocsJetBrainsMarketplaceCard/);
  assert.match(docsStartResources, /DEFAULT_MAVEN_CENTRAL_HREF = "https:\/\/search\.maven\.org\/artifact\/com\.apihug\/it-bom"/);
  assert.match(docsStartResources, /target="_blank"/);
  assert.match(docsStartResources, /img\.shields\.io\/maven-central\/v\/com\.apihug\/\$\{artifactId\}\.svg\?label=Maven%20Central/);
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

  assert.match(docsCodeBlock, /CodeCopyButton value=\{code\}/);
  assert.match(docsCodeBlock, /items-center justify-between/);
  assert.match(docsCodeBlock, /Terminal/);
  assert.match(docsCodeBlock, /PowerShell/);
  assert.match(docsCodeBlock, /Code/);

  assert.match(copyButton, /aria-label=\{copied \? "Copied code" : "Copy code"\}/);
  assert.match(copyButton, /title=\{copied \? "Copied" : "Copy"\}/);
  assert.doesNotMatch(copyButton, /<span>\{copied \? "Copied" : "Copy"\}<\/span>/);

  assert.match(snippetGroup, /props\.filename[\s\S]*['"]Code['"]/);
  assert.match(snippetGroup, /items-center justify-between/);
  assert.match(snippetGroup, /CodeCopyButton value=\{activeCode\}/);
});

test("docs copy button shows checked feedback immediately after click", () => {
  const copyButton = fs.readFileSync(path.join(repoRoot, "src", "components", "CodeCopyButton.tsx"), "utf8");

  assert.match(copyButton, /setCopyState\(\(\{ tick \}\) => \(\{ copied: true, tick: tick \+ 1 \}\)\)/);
  assert.match(copyButton, /navigator\.clipboard\.writeText\(value\)\.catch\(\(\) => \{\}\)/);
  assert.match(copyButton, /text-emerald-400/);
});

test("docs resource links render through shared components", () => {
  const mdxComponents = fs.readFileSync(path.join(repoRoot, "mdx-components.tsx"), "utf8");
  const docsStartResources = fs.readFileSync(
    path.join(repoRoot, "src", "components", "DocsStartResources.tsx"),
    "utf8",
  );

  assert.match(mdxComponents, /DocsJetBrainsMarketplaceCard/);
  assert.match(mdxComponents, /DocsMavenCentralBadge/);
  assert.match(mdxComponents, /plugins\.jetbrains\.com\/plugin\/23534-apihug--api-design-copilot/);
  assert.match(mdxComponents, /search\.maven\.org\/artifact\/com\.apihug\//);
  assert.match(mdxComponents, /p\(props\)/);
  assert.match(mdxComponents, /a\(props\)/);
  assert.match(docsStartResources, /artifactId/);
  assert.match(docsStartResources, /search\.maven\.org\/artifact\/com\.apihug\//);
  assert.match(docsStartResources, /img\.shields\.io\/maven-central\/v\/com\.apihug\/\$\{artifactId\}\.svg/);
});

test("tip components avoid nested paragraph markup", () => {
  const tipComponent = fs.readFileSync(path.join(repoRoot, "src", "components", "Tip.js"), "utf8");

  assert.doesNotMatch(tipComponent, /<p className="m-0 flex-1/);
  assert.match(tipComponent, /<div className="m-0 flex-1/);
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

test("migrated zhCN docs no longer contain YAML frontmatter blocks", () => {
  const frontmatterFiles = walkMdxFiles(zhDocsRoot)
    .filter((filePath) => fs.readFileSync(filePath, "utf8").startsWith("---"))
    .map((filePath) => path.relative(repoRoot, filePath));

  assert.deepEqual(frontmatterFiles, []);
});

test("migrated zhCN docs no longer contain legacy badge and iframe embeds", () => {
  const legacyHtmlFiles = walkMdxFiles(zhDocsRoot)
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

test("migrated docs use static public image paths instead of require image imports", () => {
  const requireImageFiles = [...walkMdxFiles(docsRoot), ...walkMdxFiles(zhDocsRoot)]
    .filter((filePath) => fs.readFileSync(filePath, "utf8").includes("require('@/img/"))
    .map((filePath) => path.relative(repoRoot, filePath));

  assert.deepEqual(requireImageFiles, []);
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

test("docs nav exposes the curated skills and rules section", () => {
  const navIndex = fs.readFileSync(
    path.join(repoRoot, "src", "app", "(docs)", "docs", "index.tsx"),
    "utf8",
  );

  for (const route of [
    "/docs/skills",
    "/docs/skills/rules",
    "/docs/skills/workflow",
    "/docs/skills/create-story",
    "/docs/skills/dev-story",
    "/docs/skills/proto-review",
    "/docs/skills/impl-review",
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
    "/zhCN-docs/spec/version",
  ]) {
    assert.match(zhNavIndex, new RegExp(route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("zhCN nav and spec landing keep clean localized labels", () => {
  const zhNavIndex = fs.readFileSync(
    path.join(repoRoot, "src", "app", "(docs)", "zhCN-docs", "index.tsx"),
    "utf8",
  );
  const zhSpecIndex = fs.readFileSync(path.join(zhDocsRoot, "spec", "index.mdx"), "utf8");
  const zhVersionSpec = fs.readFileSync(path.join(zhDocsRoot, "spec", "version.mdx"), "utf8");

  assert.match(zhNavIndex, /"快速开始":/);
  assert.match(zhNavIndex, /"技能与规则":/);
  assert.match(zhNavIndex, /"核心原则":/);
  assert.match(zhNavIndex, /\/zhCN-docs\/spec\/version/);

  assert.match(zhSpecIndex, /ApiHug 2\.0 LLM 优化规范/);
  assert.match(zhSpecIndex, /规范文档/);
  assert.match(zhSpecIndex, /\/zhCN-docs\/spec\/version/);

  assert.match(zhVersionSpec, /31142/);
  assert.match(zhVersionSpec, /31143/);
  assert.match(zhVersionSpec, /deprecated/i);
});

test("zhCN docs nav exposes the curated skills and rules section", () => {
  const zhNavIndex = fs.readFileSync(
    path.join(repoRoot, "src", "app", "(docs)", "zhCN-docs", "index.tsx"),
    "utf8",
  );

  for (const route of [
    "/zhCN-docs/skills",
    "/zhCN-docs/skills/rules",
    "/zhCN-docs/skills/workflow",
    "/zhCN-docs/skills/create-story",
    "/zhCN-docs/skills/dev-story",
    "/zhCN-docs/skills/proto-review",
    "/zhCN-docs/skills/impl-review",
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
  const zhVersionSpec = fs.readFileSync(path.join(zhDocsRoot, "spec", "version.mdx"), "utf8");
  const zhSpecIndex = fs.readFileSync(path.join(zhDocsRoot, "spec", "index.mdx"), "utf8");
  const zhNavIndex = fs.readFileSync(
    path.join(repoRoot, "src", "app", "(docs)", "zhCN-docs", "index.tsx"),
    "utf8",
  );
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
  assert.match(zhVersionSpec, /31142/);
  assert.match(zhVersionSpec, /31143/);
  assert.match(zhVersionSpec, /deprecated/i);
  assert.match(zhSpecIndex, /\/zhCN-docs\/spec\/version/);
  assert.match(zhNavIndex, /\/zhCN-docs\/spec\/version/);
});

test("swagger docs cover the current ApiHug swagger extension surface", () => {
  const protoOas = fs.readFileSync(path.join(docsRoot, "protobuf", "proto-oas.mdx"), "utf8");
  const swaggerSpec = fs.readFileSync(path.join(docsRoot, "spec", "swagger.mdx"), "utf8");

  assert.match(protoOas, /pageable/);
  assert.match(protoOas, /input_repeated/);
  assert.match(protoOas, /output_repeated/);
  assert.match(protoOas, /parameters/);
  assert.match(protoOas, /response_media_type/);
  assert.match(protoOas, /multipart/);
  assert.match(protoOas, /request_schema/);
  assert.match(protoOas, /response_schema/);
  assert.match(protoOas, /body_empty/);
  assert.match(protoOas, /session/);
  assert.match(protoOas, /path_param_name/);
  assert.match(protoOas, /internal/);
  assert.match(protoOas, /hide/);

  assert.match(swaggerSpec, /hope\.swagger\.svc/);
  assert.match(swaggerSpec, /response_media_type/);
  assert.match(swaggerSpec, /APPLICATION_VND_OPEN_XML_FORMATS_XLSX/);
  assert.match(swaggerSpec, /input_repeated/);
  assert.match(swaggerSpec, /output_repeated/);
  assert.match(swaggerSpec, /session/);
  assert.match(swaggerSpec, /path_param_name/);
  assert.match(swaggerSpec, /request_schema/);
  assert.match(swaggerSpec, /response_schema/);
  assert.match(swaggerSpec, /body_empty/);
  assert.match(swaggerSpec, /group/);
  assert.match(swaggerSpec, /questions/);
  assert.match(swaggerSpec, /multiple/);
});

test("skills docs cover the curated ApiHug rules and workflow surface", () => {
  const overview = fs.readFileSync(path.join(docsRoot, "skills", "index.mdx"), "utf8");
  const rules = fs.readFileSync(path.join(docsRoot, "skills", "rules.mdx"), "utf8");
  const workflow = fs.readFileSync(path.join(docsRoot, "skills", "workflow.mdx"), "utf8");
  const createStory = fs.readFileSync(path.join(docsRoot, "skills", "create-story.mdx"), "utf8");
  const devStory = fs.readFileSync(path.join(docsRoot, "skills", "dev-story.mdx"), "utf8");
  const protoReview = fs.readFileSync(path.join(docsRoot, "skills", "proto-review.mdx"), "utf8");
  const implReview = fs.readFileSync(path.join(docsRoot, "skills", "impl-review.mdx"), "utf8");

  assert.match(overview, /ApiHug Skills/i);
  assert.match(overview, /BMAD/i);
  assert.match(rules, /apihug-proto-api-extension-guide/i);
  assert.match(rules, /apihug-impl-golden-rule/i);
  assert.match(workflow, /contract-first/i);
  assert.match(workflow, /apihug-create-story/i);
  assert.match(createStory, /apihug-create-story/i);
  assert.match(devStory, /apihug-dev-story/i);
  assert.match(protoReview, /apihug-proto-review/i);
  assert.match(implReview, /apihug-impl-review/i);
});

test("skills source references stay visible in the migrated overview and rules docs", () => {
  const overview = fs.readFileSync(path.join(docsRoot, "skills", "index.mdx"), "utf8");
  const zhOverview = fs.readFileSync(path.join(zhDocsRoot, "skills", "index.mdx"), "utf8");
  const rules = fs.readFileSync(path.join(docsRoot, "skills", "rules.mdx"), "utf8");
  const zhRules = fs.readFileSync(path.join(zhDocsRoot, "skills", "rules.mdx"), "utf8");

  assert.match(overview, /github\.com\/apihug\/skills/);
  assert.match(overview, /spring-extension/);
  assert.match(zhOverview, /github\.com\/apihug\/skills/);
  assert.match(zhOverview, /spring-extension/);
  assert.match(rules, /github\.com\/apihug\/skills/);
  assert.match(rules, /skills\/rules/);
  assert.match(zhRules, /github\.com\/apihug\/skills/);
  assert.match(zhRules, /skills\/rules/);
});

test("what-is-apihug introduces the architecture diagram near the top of the page", () => {
  const whatIsApiHug = fs.readFileSync(path.join(docsRoot, "start", "what-is-apihug.mdx"), "utf8");

  assert.match(whatIsApiHug, /src="\/arch\.svg"/);
  assert.match(whatIsApiHug, /alt="ApiHug architecture overview"/);
  assert.match(whatIsApiHug, /ApiHug architecture overview/);
});

test("overview docs use the standard onboarding section pattern in both locales", () => {
  const englishOverviewPages = [
    path.join(docsRoot, "start", "what-is-apihug.mdx"),
    path.join(docsRoot, "skills", "index.mdx"),
    path.join(docsRoot, "skills", "workflow.mdx"),
    path.join(docsRoot, "copilot", "index.mdx"),
    path.join(docsRoot, "mcp", "001_start.mdx"),
    path.join(docsRoot, "tool", "index.mdx"),
  ];
  const zhOverviewPages = [
    path.join(zhDocsRoot, "start", "what-is-apihug.mdx"),
    path.join(zhDocsRoot, "skills", "index.mdx"),
    path.join(zhDocsRoot, "skills", "workflow.mdx"),
    path.join(zhDocsRoot, "copilot", "index.mdx"),
    path.join(zhDocsRoot, "mcp", "001_start.mdx"),
    path.join(zhDocsRoot, "tool", "index.mdx"),
  ];

  for (const filePath of englishOverviewPages) {
    const source = fs.readFileSync(filePath, "utf8");
    assert.match(source, /## What It Is/);
    assert.match(source, /## Why It Matters/);
    assert.match(source, /## How It Fits/);
    assert.match(source, /## Next Step/);
  }

  for (const filePath of zhOverviewPages) {
    const source = fs.readFileSync(filePath, "utf8");
    assert.match(source, /## 它是什么/);
    assert.match(source, /## 为什么重要/);
    assert.match(source, /## 它如何融入整体流程/);
    assert.match(source, /## 下一步/);
  }
});

test("zhCN skills docs localize the curated ApiHug rules and workflow surface", () => {
  const overview = fs.readFileSync(path.join(zhDocsRoot, "skills", "index.mdx"), "utf8");
  const rules = fs.readFileSync(path.join(zhDocsRoot, "skills", "rules.mdx"), "utf8");
  const workflow = fs.readFileSync(path.join(zhDocsRoot, "skills", "workflow.mdx"), "utf8");
  const createStory = fs.readFileSync(path.join(zhDocsRoot, "skills", "create-story.mdx"), "utf8");
  const devStory = fs.readFileSync(path.join(zhDocsRoot, "skills", "dev-story.mdx"), "utf8");
  const protoReview = fs.readFileSync(path.join(zhDocsRoot, "skills", "proto-review.mdx"), "utf8");
  const implReview = fs.readFileSync(path.join(zhDocsRoot, "skills", "impl-review.mdx"), "utf8");

  assert.match(overview, /ApiHug Skills/i);
  assert.match(overview, /BMAD/i);
  assert.match(rules, /apihug-proto-api-extension-guide/i);
  assert.match(rules, /apihug-impl-golden-rule/i);
  assert.match(workflow, /contract-first/i);
  assert.match(createStory, /apihug-create-story/i);
  assert.match(devStory, /apihug-dev-story/i);
  assert.match(protoReview, /apihug-proto-review/i);
  assert.match(implReview, /apihug-impl-review/i);
});

test("zhCN skills overview stays readable Chinese instead of mojibake", () => {
  const overview = fs.readFileSync(path.join(zhDocsRoot, "skills", "index.mdx"), "utf8");

  assert.match(overview, /AI 工作流只有在边界清晰时才可靠/);
  assert.match(overview, /工作流页面和规则页面必须配套阅读/);
  assert.doesNotMatch(overview, /鎶€鑳戒笌瑙勫垯|杩欎竴缁勬枃妗?/);
});

test("app docs header exposes english and zhCN docs entry points", () => {
  const appHeader = fs.readFileSync(path.join(repoRoot, "src", "components", "header.tsx"), "utf8");

  assert.match(appHeader, />\s*English\s*</);
  assert.match(appHeader, />\s*中文\s*</);
  assert.doesNotMatch(appHeader, /English Docs/);
  assert.doesNotMatch(appHeader, /中文文档/);
  assert.match(appHeader, /href="\/docs"|href='\/docs'|href=\{["']\/docs["']\}/);
  assert.match(appHeader, /href="\/zhCN-docs"|href='\/zhCN-docs'|href=\{["']\/zhCN-docs["']\}/);
  assert.doesNotMatch(appHeader, /\/zhCN-docs\/start\.html/);
  assert.doesNotMatch(appHeader, /href="\/zhCN"|href='\/zhCN'|href=\{["']\/zhCN["']\}/);
  assert.match(appHeader, /aria-controls="docs-locale-menu"|aria-controls='docs-locale-menu'/);
});

test("app docs header locale panel avoids a hover gap under the docs trigger", () => {
  const appHeader = fs.readFileSync(path.join(repoRoot, "src", "components", "header.tsx"), "utf8");

  assert.doesNotMatch(appHeader, /id="docs-locale-menu"[\s\S]*mt-3/);
  assert.match(appHeader, /className="absolute left-0 top-full z-20 pt-3"/);
});

test("desktop logo adds a subtitle lockup without changing mobile behavior", () => {
  const logo = fs.readFileSync(path.join(repoRoot, "src", "components", "logo.tsx"), "utf8");

  assert.match(logo, /API as Architecture/);
  assert.match(logo, /hidden[\s\S]*md:flex/);
  assert.match(logo, /md:hidden/);
  assert.match(logo, /font-mono/);
});

test("root layout restores the old Google Analytics snippet", () => {
  const rootLayout = fs.readFileSync(path.join(repoRoot, "src", "app", "layout.tsx"), "utf8");

  assert.match(rootLayout, /https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-PXR19X43CS/);
  assert.match(rootLayout, /window\.dataLayer = window\.dataLayer \|\| \[\];/);
  assert.match(rootLayout, /gtag\('config', 'G-PXR19X43CS'\);/);
});

test("home hero title keeps the ApiHug eyebrow without oversized headline styling", () => {
  const hero = fs.readFileSync(path.join(repoRoot, "src", "components", "home", "hero.tsx"), "utf8");

  assert.match(hero, /API as Architecture/);
  assert.match(hero, /pt-8 sm:pt-10/);
  assert.match(hero, /font-mono text-sm\/6 font-medium tracking-widest text-gray-500 uppercase/);
  assert.match(hero, /<h1 className="mt-2 px-2 text-4xl\/11 font-medium tracking-tight text-balance/);
  assert.doesNotMatch(hero, /xl:text-8xl/);
  assert.doesNotMatch(hero, /max-lg:font-medium/);
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
  const englishDocPage = fs.readFileSync(
    path.join(repoRoot, "src", "app", "(docs)", "docs", "[...slug]", "page.tsx"),
    "utf8",
  );
  const zhDocPage = fs.readFileSync(
    path.join(repoRoot, "src", "app", "(docs)", "zhCN-docs", "[...slug]", "page.tsx"),
    "utf8",
  );

  assert.doesNotMatch(pagination, /import index from "..\/app\/\(docs\)\/docs\/index"/);
  assert.match(pagination, /currentPath/);
  assert.match(pagination, /navIndex/);
  assert.match(englishDocPage, /<Pagination currentPath=\{`\/docs\/\$\{slugStr\}`\} navIndex=\{index\} \/>/);
  assert.match(zhDocPage, /<Pagination currentPath=\{`\/zhCN-docs\/\$\{slugStr\}`\} navIndex=\{zhIndex\} \/>/);
});

test("docs sidebar switches to zhCN nav for zhCN routes", () => {
  const docsSidebar = fs.readFileSync(path.join(repoRoot, "src", "components", "docs-sidebar.tsx"), "utf8");

  assert.match(docsSidebar, /^"use client";/m);
  assert.match(docsSidebar, /usePathname/);
  assert.match(docsSidebar, /import index from "..\/app\/\(docs\)\/docs\/index"/);
  assert.match(docsSidebar, /import zhIndex from "..\/app\/\(docs\)\/zhCN-docs\/index"/);
  assert.match(docsSidebar, /pathname\.startsWith\("\/zhCN-docs"\)/);
  assert.match(docsSidebar, /let navIndex = pathname\.startsWith\("\/zhCN-docs"\) \? zhIndex : index/);
});

test("docs sidebar only highlights the exact current doc link", () => {
  const docsSidebarLink = fs.readFileSync(
    path.join(repoRoot, "src", "components", "docs-sidebar-link.tsx"),
    "utf8",
  );

  assert.match(docsSidebarLink, /function normalizePath/);
  assert.match(docsSidebarLink, /value\.replace\(\/\\\/\+\$\/, ""\)/);
  assert.match(docsSidebarLink, /currentPath === targetPath \? "page" : undefined/);
  assert.doesNotMatch(docsSidebarLink, /startsWith\(`\$\{path\}\/`\)/);
});

test("zhCN docs index route redirects to what-is-apihug", () => {
  const zhDocsIndexPage = fs.readFileSync(
    path.join(repoRoot, "src", "app", "(docs)", "zhCN-docs", "page.tsx"),
    "utf8",
  );

  assert.match(zhDocsIndexPage, /permanentRedirect/);
  assert.match(zhDocsIndexPage, /\/zhCN-docs\/start\/what-is-apihug/);
});

test("home link button lets page-level variants override the default light theme colors", () => {
  const linkButton = fs.readFileSync(
    path.join(repoRoot, "src", "components", "home", "link-button.tsx"),
    "utf8",
  );
  const enterpriseSection = fs.readFileSync(
    path.join(repoRoot, "src", "components", "home", "enterprise-factory-section.tsx"),
    "utf8",
  );

  assert.match(linkButton, /clsx\(\s*"inline-block rounded-4xl bg-black px-4 py-2 text-sm\/6 font-semibold text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600",\s*className,\s*\)/);
  assert.match(enterpriseSection, /Learn more/);
  assert.match(enterpriseSection, /className="inline-block rounded-4xl !bg-white px-4 py-2 text-sm\/6 font-semibold !text-gray-950 inset-ring inset-ring-gray-950\/8 hover:!bg-gray-50 dark:!bg-gray-950 dark:!text-white dark:inset-ring-white\/15 dark:hover:!bg-gray-900"/);
});

test("spring and zhCN backend reference docs stay aligned with the current source-backed surface", () => {
  const springMock = fs.readFileSync(path.join(docsRoot, "framework", "spring-mock.mdx"), "utf8");
  const springCommon = fs.readFileSync(path.join(docsRoot, "framework", "spring-common.mdx"), "utf8");
  const springApi = fs.readFileSync(path.join(docsRoot, "framework", "spring-api.mdx"), "utf8");
  const zhSpringSecurity = fs.readFileSync(
    path.join(zhDocsRoot, "framework", "spring-security.mdx"),
    "utf8",
  );
  const zhSpringApi = fs.readFileSync(path.join(zhDocsRoot, "framework", "spring-api.mdx"), "utf8");
  const zhSwagger = fs.readFileSync(path.join(zhDocsRoot, "spec", "swagger.mdx"), "utf8");
  const zhDomain = fs.readFileSync(path.join(zhDocsRoot, "spec", "domain.mdx"), "utf8");
  const zhAuthority = fs.readFileSync(
    path.join(zhDocsRoot, "framework", "widget", "authority.mdx"),
    "utf8",
  );

  assert.match(springMock, /AutoConfigureWireMock/);
  assert.match(springMock, /wiremock\.server\.port/);
  assert.match(springMock, /HopeContractConfiguration/);
  assert.match(springMock, /WireMockStubCustomizer/);

  assert.match(springCommon, /HopeSecurityManager/);
  assert.match(springCommon, /SecurityContext/);
  assert.doesNotMatch(springCommon, /will not be read at runtime/);

  assert.match(springApi, /hope\.api/);
  assert.match(springApi, /\/hope\/meta\/versions/);
  assert.match(springApi, /OpenAPI 3/);
  assert.doesNotMatch(springApi, /hope\.open\.api/);
  assert.doesNotMatch(springApi, /Standard OAS \(Swagger 2\.0\)/);

  assert.match(zhSpringSecurity, /Spring Security/);
  assert.match(zhSpringSecurity, /JwtDecoder/);
  assert.match(zhSpringSecurity, /SpringSecurityExceptionHandler/);
  assert.doesNotMatch(zhSpringSecurity, /<artifactId>spring-boot-starter-security<\/artifactId>/);
  assert.doesNotMatch(zhSpringSecurity, /SecurityAutoConfiguration/);

  assert.match(zhSpringApi, /hope\.api/);
  assert.match(zhSpringApi, /\/hope\/meta\/versions/);
  assert.doesNotMatch(zhSpringApi, /`hope\.open\.api\./);
  assert.doesNotMatch(zhSpringApi, /标准OAS\(Swagger2\.0\)/);

  assert.match(zhSwagger, /APPLICATION_VND_OPEN_XML_FORMATS_XLSX/);
  assert.match(zhSwagger, /is_repeated/);
  assert.match(zhSwagger, /request_schema/);
  assert.match(zhSwagger, /response_schema/);
  assert.match(zhSwagger, /body_empty/);
  assert.match(zhSwagger, /questions/);
  assert.match(zhSwagger, /multipart/);
  assert.match(zhSwagger, /internal/);
  assert.match(zhSwagger, /hide/);
  assert.match(zhSwagger, /path_param_name/);
  assert.doesNotMatch(zhSwagger, /APPLICATION_XLSX/);
  assert.match(zhSwagger, /input_repeated/);
  assert.match(zhSwagger, /output_repeated/);
  assert.match(zhSwagger, /max_length: 64;/);
  assert.match(zhSwagger, /maximum: 12345;/);

  assert.match(zhDomain, /persistence\.proto/);
  assert.match(zhDomain, /nullable: false/);
  assert.match(zhDomain, /TIME_WITH_TIMEZONE/);
  assert.match(zhDomain, /TIMESTAMP_WITH_TIMEZONE/);
  assert.match(zhDomain, /ROWID/);
  assert.doesNotMatch(zhDomain, /nullable:\s*TRUE|nullable:\s*FALSE|unique:\s*TRUE|unique:\s*FALSE/);
  assert.match(zhDomain, /length: 32;/);
  assert.match(zhDomain, /precision: 10;/);
  assert.match(zhDomain, /scale: 2;/);

  assert.match(zhAuthority, /output_repeated/);
  assert.match(zhAuthority, /authorities: \["BOOK_DELETE"\]/);
  assert.doesNotMatch(zhAuthority, /out_plural:\s*true/);
  assert.doesNotMatch(zhAuthority, /spring-boot-starter-security/);
});

test("spring common docs keep the source repository reference in both locales", () => {
  const springCommon = fs.readFileSync(path.join(docsRoot, "framework", "spring-common.mdx"), "utf8");
  const zhSpringCommon = fs.readFileSync(path.join(zhDocsRoot, "framework", "spring-common.mdx"), "utf8");

  assert.match(springCommon, /github\.com\/apihug\/skills/);
  assert.match(springCommon, /spring-extension/);
  assert.match(springCommon, /skills\/spring-extension/);
  assert.match(zhSpringCommon, /github\.com\/apihug\/skills/);
  assert.match(zhSpringCommon, /spring-extension/);
  assert.match(zhSpringCommon, /skills\/spring-extension/);
});

test("product usage docs use task-oriented structure in both locales", () => {
  const ideaIndex = fs.readFileSync(path.join(docsRoot, "idea", "index.mdx"), "utf8");
  const ideaStart = fs.readFileSync(path.join(docsRoot, "idea", "002-start-project.mdx"), "utf8");
  const ideaEditor = fs.readFileSync(path.join(docsRoot, "idea", "015-editor.mdx"), "utf8");
  const uiIndex = fs.readFileSync(path.join(docsRoot, "ui", "index.mdx"), "utf8");
  const uiVue = fs.readFileSync(path.join(docsRoot, "ui", "002_vue.mdx"), "utf8");
  const uiApp = fs.readFileSync(path.join(docsRoot, "ui", "003_app.mdx"), "utf8");
  const uploadHow = fs.readFileSync(path.join(docsRoot, "how", "001_support_upload_file.mdx"), "utf8");
  const kolaIndex = fs.readFileSync(path.join(docsRoot, "kola", "index.mdx"), "utf8");
  const kolaWhat = fs.readFileSync(path.join(docsRoot, "kola", "001_what_is_kola.mdx"), "utf8");
  const kolaDesign = fs.readFileSync(path.join(docsRoot, "kola", "002_design_of_kola.mdx"), "utf8");
  const ideaComponents = fs.readFileSync(path.join(docsRoot, "idea", "006-components.mdx"), "utf8");
  const ideaEntity = fs.readFileSync(path.join(docsRoot, "idea", "009-entity.mdx"), "utf8");
  const howMinMax = fs.readFileSync(
    path.join(docsRoot, "how", "006_understand_max_min_length_items_properties.mdx"),
    "utf8",
  );
  const kolaPrinciples = fs.readFileSync(path.join(docsRoot, "kola", "004_principle.mdx"), "utf8");
  const kolaToolChain = fs.readFileSync(path.join(docsRoot, "kola", "005_tool_chain.mdx"), "utf8");

  const zhIdeaIndex = fs.readFileSync(path.join(zhDocsRoot, "idea", "index.mdx"), "utf8");
  const zhIdeaStart = fs.readFileSync(path.join(zhDocsRoot, "idea", "002-start-project.mdx"), "utf8");
  const zhIdeaEditor = fs.readFileSync(path.join(zhDocsRoot, "idea", "015-editor.mdx"), "utf8");
  const zhUiIndex = fs.readFileSync(path.join(zhDocsRoot, "ui", "index.mdx"), "utf8");
  const zhUiVue = fs.readFileSync(path.join(zhDocsRoot, "ui", "002_vue.mdx"), "utf8");
  const zhUiApp = fs.readFileSync(path.join(zhDocsRoot, "ui", "003_app.mdx"), "utf8");
  const zhUploadHow = fs.readFileSync(path.join(zhDocsRoot, "how", "001_support_upload_file.mdx"), "utf8");
  const zhKolaIndex = fs.readFileSync(path.join(zhDocsRoot, "kola", "index.mdx"), "utf8");
  const zhKolaWhat = fs.readFileSync(path.join(zhDocsRoot, "kola", "001_what_is_kola.mdx"), "utf8");
  const zhKolaDesign = fs.readFileSync(path.join(zhDocsRoot, "kola", "002_design_of_kola.mdx"), "utf8");
  const zhIdeaComponents = fs.readFileSync(path.join(zhDocsRoot, "idea", "006-components.mdx"), "utf8");
  const zhIdeaEntity = fs.readFileSync(path.join(zhDocsRoot, "idea", "009-entity.mdx"), "utf8");
  const zhHowMinMax = fs.readFileSync(
    path.join(zhDocsRoot, "how", "006_understand_max_min_length_items_properties.mdx"),
    "utf8",
  );
  const zhKolaPrinciples = fs.readFileSync(path.join(zhDocsRoot, "kola", "004_principle.mdx"), "utf8");
  const zhKolaToolChain = fs.readFileSync(path.join(zhDocsRoot, "kola", "005_tool_chain.mdx"), "utf8");
  const zhKolaConfig = fs.readFileSync(path.join(zhDocsRoot, "kola", "006_configurations.mdx"), "utf8");

  assert.match(ideaIndex, /## What This Section Covers/);
  assert.match(ideaIndex, /## Recommended Path/);
  assert.match(ideaIndex, /## Key Tasks/);
  assert.match(ideaStart, /## When To Use It/);
  assert.match(ideaStart, /## Steps/);
  assert.match(ideaStart, /## Result/);
  assert.match(ideaEditor, /## When To Use It/);
  assert.match(ideaEditor, /## Result/);

  assert.match(uiIndex, /## When To Use It/);
  assert.match(uiIndex, /## Recommended Path/);
  assert.match(uiVue, /## When To Use It/);
  assert.match(uiVue, /## Steps/);
  assert.match(uiApp, /## When To Use It/);
  assert.match(uiApp, /## Runtime Notes/);
  assert.match(uiApp, /enableFrontVue = true/);

  assert.match(uploadHow, /multipart: true;/);
  assert.match(uploadHow, /empty: false;/);
  assert.doesNotMatch(uploadHow, /\bFALSE\b/);
  assert.doesNotMatch(uploadHow, /multiple:\s*true/);

  assert.match(kolaIndex, /## When To Use It/);
  assert.match(kolaIndex, /## Steps/);
  assert.match(kolaIndex, /\.\/gradlew\.bat \{proto_module\}:kolaTest --stacktrace/);
  assert.doesNotMatch(kolaIndex, /gradlwe\.bat/);
  assert.match(kolaWhat, /## Why It Exists/);
  assert.match(kolaDesign, /## The Problem Kola Tries To Solve/);
  assert.match(kolaPrinciples, /## Reuse Before Reinvention/);
  assert.match(kolaToolChain, /## Core Components/);
  assert.match(kolaToolChain, /## How the Flow Works/);
  assert.doesNotMatch(kolaDesign, /TBD/);
  assert.doesNotMatch(kolaPrinciples, /TBD/);
  assert.doesNotMatch(kolaToolChain, /TBD/);
  assert.doesNotMatch(ideaComponents, /\bFALSE\b/);
  assert.doesNotMatch(ideaEntity, /\bFALSE\b/);
  assert.doesNotMatch(howMinMax, /\bFALSE\b/);

  assert.match(zhIdeaIndex, /## 本节包含什么/);
  assert.match(zhIdeaIndex, /## 推荐阅读顺序/);
  assert.match(zhIdeaIndex, /## 常用任务/);
  assert.match(zhIdeaStart, /## 适用场景/);
  assert.match(zhIdeaStart, /## 操作步骤/);
  assert.match(zhIdeaStart, /## 结果/);
  assert.match(zhIdeaEditor, /## 适用场景/);
  assert.match(zhIdeaEditor, /## 结果/);

  assert.match(zhUiIndex, /## 适用场景/);
  assert.match(zhUiIndex, /## 推荐阅读顺序/);
  assert.match(zhUiVue, /## 适用场景/);
  assert.match(zhUiVue, /## 操作步骤/);
  assert.match(zhUiApp, /## 适用场景/);
  assert.match(zhUiApp, /## 运行时说明/);
  assert.match(zhUiApp, /enableFrontVue = true/);

  assert.match(zhUploadHow, /multipart: true;/);
  assert.match(zhUploadHow, /empty: false;/);
  assert.doesNotMatch(zhUploadHow, /\bFALSE\b/);
  assert.doesNotMatch(zhUploadHow, /multiple:\s*true/);

  assert.match(zhKolaIndex, /## 适用场景/);
  assert.match(zhKolaIndex, /## 操作步骤/);
  assert.match(zhKolaIndex, /\.\/gradlew\.bat \{proto_module\}:kolaTest --stacktrace/);
  assert.doesNotMatch(zhKolaIndex, /gradlwe\.bat/);
  assert.match(zhKolaWhat, /## 为什么需要它/);
  assert.match(zhKolaDesign, /## Kola 要解决什么问题/);
  assert.match(zhKolaPrinciples, /## 先复用，再发明/);
  assert.match(zhKolaToolChain, /## 核心组成/);
  assert.match(zhKolaToolChain, /## 工作流如何串起来/);
  assert.match(zhKolaConfig, /## 构建侧关注点/);
  assert.doesNotMatch(zhKolaDesign, /TBD/);
  assert.doesNotMatch(zhKolaPrinciples, /TBD/);
  assert.doesNotMatch(zhKolaToolChain, /TBD/);
  assert.doesNotMatch(zhKolaConfig, /TBD/);
  assert.doesNotMatch(zhIdeaComponents, /\bFALSE\b/);
  assert.doesNotMatch(zhIdeaEntity, /\bFALSE\b/);
  assert.doesNotMatch(zhHowMinMax, /\bFALSE\b/);
});

test("principles docs use a consistent narrative structure in both locales", () => {
  const englishPrinciples = [
    path.join(docsRoot, "principles", "single-source-of-truth.mdx"),
    path.join(docsRoot, "principles", "leverage-integration.mdx"),
    path.join(docsRoot, "principles", "empathy-is-important.mdx"),
    path.join(docsRoot, "principles", "common-language.mdx"),
  ];
  const zhPrinciples = [
    path.join(zhDocsRoot, "principles", "single-source-of-truth.mdx"),
    path.join(zhDocsRoot, "principles", "leverage-integration.mdx"),
    path.join(zhDocsRoot, "principles", "empathy-is-important.mdx"),
    path.join(zhDocsRoot, "principles", "common-language.mdx"),
  ];

  for (const filePath of englishPrinciples) {
    const source = fs.readFileSync(filePath, "utf8");
    assert.match(source, /## What It Means/);
    assert.match(source, /## Why It Matters/);
    assert.match(source, /## Result/);
    assert.doesNotMatch(source, /TipInfo/);
    assert.doesNotMatch(source, /To be done/i);
  }

  for (const filePath of zhPrinciples) {
    const source = fs.readFileSync(filePath, "utf8");
    assert.match(source, /## 它是什么/);
    assert.match(source, /## 为什么重要/);
    assert.match(source, /## 结果/);
    assert.doesNotMatch(source, /TipInfo/);
    assert.doesNotMatch(source, /To be done/i);
  }
});

test("zhCN principles terminology and nav labels stay aligned", () => {
  const zhPrinciplesNav = fs.readFileSync(
    path.join(repoRoot, "src", "app", "(docs)", "zhCN-docs", "index.tsx"),
    "utf8",
  );
  const zhSsot = fs.readFileSync(path.join(zhDocsRoot, "principles", "single-source-of-truth.mdx"), "utf8");
  const zhEmpathy = fs.readFileSync(path.join(zhDocsRoot, "principles", "empathy-is-important.mdx"), "utf8");
  const zhIntegration = fs.readFileSync(path.join(zhDocsRoot, "principles", "leverage-integration.mdx"), "utf8");
  const zhCommonLanguage = fs.readFileSync(path.join(zhDocsRoot, "principles", "common-language.mdx"), "utf8");
  const zhKolaWhat = fs.readFileSync(path.join(zhDocsRoot, "kola", "001_what_is_kola.mdx"), "utf8");

  assert.match(zhPrinciplesNav, /工程中的共情/);
  assert.match(zhPrinciplesNav, /单一可信源/);
  assert.match(zhPrinciplesNav, /借力集成/);
  assert.doesNotMatch(zhPrinciplesNav, /同理心很重要|单一信任源|集成和开放/);

  assert.match(zhSsot, /单一可信源/);
  assert.doesNotMatch(zhSsot, /payload/);
  assert.match(zhSsot, /接口载荷/);
  assert.match(zhSsot, /Specification First（规范优先）/);

  assert.match(zhIntegration, /棕地项目/);
  assert.match(zhIntegration, /Greenfield（全新开局）/);
  assert.match(zhIntegration, /Brownfield（在现有系统上持续演进）/);

  assert.doesNotMatch(zhCommonLanguage, /API 表面/);
  assert.match(zhCommonLanguage, /API 结构/);

  assert.doesNotMatch(zhEmpathy, /共享沟通面/);
  assert.match(zhEmpathy, /共享协作界面/);

  assert.doesNotMatch(zhKolaWhat, /单一信任源/);
  assert.match(zhKolaWhat, /单一可信源/);
});
