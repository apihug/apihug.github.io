import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();

test("local gitee build has a Windows-native entrypoint", () => {
  const scriptPath = path.join(repoRoot, "local-gitee-build.ps1");
  assert.ok(fs.existsSync(scriptPath), "expected local-gitee-build.ps1 to exist");
});

test("local gitee build shell wrapper has a real shebang", () => {
  const scriptPath = path.join(repoRoot, "local-gitee-build.sh");
  const content = fs.readFileSync(scriptPath, "utf8");

  assert.match(content, /^#!\/usr\/bin\/env sh/m, "expected local-gitee-build.sh to declare a POSIX shell");
});

test("local gitee build no longer hardcodes the stale deploy repo and branch", () => {
  const scriptPath = path.join(repoRoot, "scripts", "local-gitee-build.mjs");
  const content = fs.readFileSync(scriptPath, "utf8");

  assert.doesNotMatch(content, /apihugcom-build\.git/, "expected stale apihugcom-build remote to be removed");
  assert.doesNotMatch(content, /\bmaster\b/, "expected stale master branch target to be removed");
});

test("local gitee build initializes a fresh branch without requiring an existing commit", () => {
  const scriptPath = path.join(repoRoot, "scripts", "local-gitee-build.mjs");
  const content = fs.readFileSync(scriptPath, "utf8");

  assert.match(
    content,
    /git", \["(?:switch|checkout)", "--orphan", deployBranch\]/,
    "expected deploy script to create an orphan branch in the fresh out/ repository",
  );
});

test("local gitee build uses cmd.exe only for Windows cmd wrappers and avoids a global shell", () => {
  const scriptPath = path.join(repoRoot, "scripts", "local-gitee-build.mjs");
  const content = fs.readFileSync(scriptPath, "utf8");

  assert.match(content, /process\.env\.ComSpec/, "expected deploy script to route Windows .cmd tools through ComSpec");
  assert.doesNotMatch(content, /shell:\s*process\.platform\s*===\s*["']win32["']/, "expected deploy script to avoid a global shell");
});
