import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const docsRoot = path.join(repoRoot, "src", "docs");
const zhDocsRoot = path.join(repoRoot, "src", "zhCN-docs");

test("milestone and changelog docs use the cleaned release-history wording", () => {
  const milestoneIndex = fs.readFileSync(path.join(docsRoot, "milestone", "index.mdx"), "utf8");
  const zhMilestoneIndex = fs.readFileSync(path.join(zhDocsRoot, "milestone", "index.mdx"), "utf8");
  const milestone20240510 = fs.readFileSync(
    path.join(docsRoot, "milestone", "milestone-20240510.mdx"),
    "utf8",
  );
  const zhMilestone20240510 = fs.readFileSync(
    path.join(zhDocsRoot, "milestone", "milestone-20240510.mdx"),
    "utf8",
  );
  const milestone20240222 = fs.readFileSync(
    path.join(docsRoot, "milestone", "milestone-20240222.mdx"),
    "utf8",
  );
  const zhMilestone20240222 = fs.readFileSync(
    path.join(zhDocsRoot, "milestone", "milestone-20240222.mdx"),
    "utf8",
  );
  const pluginChangelog = fs.readFileSync(path.join(docsRoot, "changelog", "plugin.mdx"), "utf8");
  const zhPluginChangelog = fs.readFileSync(path.join(zhDocsRoot, "changelog", "plugin.mdx"), "utf8");
  const sdk078Detail = fs.readFileSync(
    path.join(docsRoot, "changelog", "detail", "SDK_0.7.8.mdx"),
    "utf8",
  );
  const zhSdk078Detail = fs.readFileSync(
    path.join(zhDocsRoot, "changelog", "detail", "SDK_0.7.8.mdx"),
    "utf8",
  );
  const sdk086Detail = fs.readFileSync(
    path.join(docsRoot, "changelog", "detail", "SDK_0.8.6.mdx"),
    "utf8",
  );
  const zhSdk086Detail = fs.readFileSync(
    path.join(zhDocsRoot, "changelog", "detail", "SDK_0.8.6.mdx"),
    "utf8",
  );

  assert.match(milestoneIndex, /ApiHug Milestones/);
  assert.doesNotMatch(milestoneIndex, /All the Milestone of the ApiHug/);
  assert.match(zhMilestoneIndex, /ApiHug 里程碑/);
  assert.doesNotMatch(zhMilestoneIndex, /All the Milestone of the ApiHug/);

  assert.match(milestone20240510, /message2/);
  assert.match(milestone20240510, /nullable: false/);
  assert.doesNotMatch(milestone20240510, /nullable: FALSE|updatable: FALSE/);
  assert.match(zhMilestone20240510, /message2/);
  assert.match(zhMilestone20240510, /nullable: false/);
  assert.doesNotMatch(zhMilestone20240510, /nullable: FALSE|updatable: FALSE/);

  assert.match(milestone20240222, /empty: false;/);
  assert.doesNotMatch(milestone20240222, /empty: FALSE/);
  assert.match(zhMilestone20240222, /empty: false;/);
  assert.doesNotMatch(zhMilestone20240222, /empty: FALSE/);

  assert.doesNotMatch(pluginChangelog, /\/docs\/kola#upgrade-steps/);
  assert.doesNotMatch(pluginChangelog, /please follow: \[Kola\]/);
  assert.doesNotMatch(pluginChangelog, /github\.com\/apihug\/apihug\.com\/blob\/master\/docs\/versions\/001-milestone\.md/);
  assert.match(pluginChangelog, /Kola milestone notes/);
  assert.match(pluginChangelog, /Milestone 2024-02-22/);

  assert.doesNotMatch(zhPluginChangelog, /\/docs\/kola#upgrade-steps/);
  assert.doesNotMatch(zhPluginChangelog, /please follow: \[Kola\]/);
  assert.doesNotMatch(zhPluginChangelog, /github\.com\/apihug\/apihug\.com\/blob\/master\/zhCN-docs\/versions\/001-milestone\.md/);
  assert.match(zhPluginChangelog, /Kola 相关里程碑说明/);
  assert.match(zhPluginChangelog, /Milestone 2024-02-22/);

  assert.doesNotMatch(sdk086Detail, /This really make the code merger guy crazy!/);
  assert.doesNotMatch(sdk086Detail, /Code generate more sortable, relief from code merger effort/);
  assert.match(sdk086Detail, /Stable Generated Diffs/);
  assert.match(sdk086Detail, /generated files are emitted in a more stable order/i);

  assert.doesNotMatch(zhSdk086Detail, /\[绠€浣撲腑鏂?/);
  assert.match(zhSdk086Detail, /\[简体中文\]/);
  assert.match(zhSdk086Detail, /生成文件会以更稳定的顺序输出/);

  assert.doesNotMatch(sdk078Detail, /If you never touch the `ApiHug` domain entity management/);
  assert.doesNotMatch(sdk078Detail, /`0\.7\.8-RELEASE` Add features:/);
  assert.doesNotMatch(sdk078Detail, /You need to backup your `@Derived` method before run/);
  assert.doesNotMatch(sdk078Detail, /Take an exist `repository`/);
  assert.doesNotMatch(sdk078Detail, /This way migration need more manually job, but much clearly/);
  assert.match(sdk078Detail, /limited impact on your project/);
  assert.match(sdk078Detail, /`0\.7\.8-RELEASE` introduced:/);
  assert.match(sdk078Detail, /Use an existing repository such as/);
  assert.match(sdk078Detail, /This migration path involves more manual work/);

  assert.doesNotMatch(zhSdk078Detail, /If you never touch the `ApiHug` domain entity management/);
  assert.doesNotMatch(zhSdk078Detail, /`0\.7\.8-RELEASE` Add features:/);
  assert.doesNotMatch(zhSdk078Detail, /You need to backup your `@Derived` method before run/);
  assert.doesNotMatch(zhSdk078Detail, /Take an exist `repository`/);
  assert.match(zhSdk078Detail, /影响通常会比较有限/);
  assert.match(zhSdk078Detail, /`0\.7\.8-RELEASE` 主要引入了两个 repository 相关变化：/);
  assert.match(zhSdk078Detail, /下面以模块 `book-app` 中已有的 repository .* 为例/);
  assert.match(zhSdk078Detail, /这条迁移路径需要更多手工操作/);
});
