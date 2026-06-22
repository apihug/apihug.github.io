import { rmSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const outDir = path.join(repoRoot, "out");

const args = new Set(process.argv.slice(2));
const isDryRun = args.has("--dry-run");
const wantsHelp = args.has("--help") || args.has("-h");

if (wantsHelp) {
  process.stdout.write(`Usage: node scripts/local-gitee-build.mjs [--dry-run]

Builds the static export into ./out and force-pushes it to the configured Gitee deploy target.

Environment overrides:
  GITEE_DEPLOY_REMOTE   Remote name to read URL from (default: gitee)
  GITEE_DEPLOY_URL      Explicit deploy URL; overrides remote lookup
  GITEE_DEPLOY_BRANCH   Branch to push to (default: main)
  GITEE_DEPLOY_MESSAGE  Commit message (default: deploy: static build)
`);
  process.exit(0);
}

const remoteName = process.env.GITEE_DEPLOY_REMOTE || "gitee";
const deployBranch = process.env.GITEE_DEPLOY_BRANCH || "main";
const commitMessage = process.env.GITEE_DEPLOY_MESSAGE || "deploy: static build";

function bin(name) {
  return process.platform === "win32" ? `${name}.cmd` : name;
}

function quoteForCmd(arg) {
  if (/[\s"&^|<>]/.test(arg)) {
    return `"${arg.replace(/"/g, '\\"')}"`;
  }

  return arg;
}

function run(command, commandArgs, options = {}) {
  const cwd = options.cwd || repoRoot;
  const printable = [command, ...commandArgs].join(" ");
  process.stdout.write(`> ${printable}\n`);

  if (isDryRun) {
    return "";
  }

  let actualCommand = command;
  let actualArgs = commandArgs;

  if (process.platform === "win32" && command.toLowerCase().endsWith(".cmd")) {
    actualCommand = process.env.ComSpec || "cmd.exe";
    actualArgs = ["/d", "/s", "/c", [command, ...commandArgs].map(quoteForCmd).join(" ")];
  }

  const result = spawnSync(actualCommand, actualArgs, {
    cwd,
    stdio: options.captureOutput ? ["ignore", "pipe", "pipe"] : "inherit",
    encoding: "utf8",
  });

  if (result.status !== 0) {
    if (options.captureOutput && result.stderr) {
      process.stderr.write(result.stderr);
    }
    process.exit(result.status ?? 1);
  }

  return options.captureOutput ? result.stdout.trim() : "";
}

function resolveDeployUrl() {
  if (process.env.GITEE_DEPLOY_URL) {
    return process.env.GITEE_DEPLOY_URL;
  }

  const remoteUrl = run("git", ["remote", "get-url", remoteName], {
    cwd: repoRoot,
    captureOutput: true,
  });

  if (!remoteUrl) {
    process.stderr.write(`Unable to resolve remote URL for "${remoteName}".\n`);
    process.exit(1);
  }

  return remoteUrl;
}

const deployUrl = resolveDeployUrl();

run(bin("pnpm"), ["build"], { cwd: repoRoot });

if (!existsSync(outDir)) {
  process.stderr.write(`Build output directory not found: ${outDir}\n`);
  process.exit(1);
}

rmSync(path.join(outDir, ".git"), { recursive: true, force: true });

run("git", ["init"], { cwd: outDir });
run("git", ["checkout", "--orphan", deployBranch], { cwd: outDir });
run("git", ["add", "-A"], { cwd: outDir });
run("git", ["commit", "--allow-empty", "-m", commitMessage], { cwd: outDir });
run("git", ["push", "--force", deployUrl, `HEAD:${deployBranch}`], { cwd: outDir });
