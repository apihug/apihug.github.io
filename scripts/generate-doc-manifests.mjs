import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();

function collectMdxFiles(rootDir) {
  const files = [];

  function walk(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name.endsWith(".mdx")) {
        files.push(fullPath);
      }
    }
  }

  walk(rootDir);
  return files.sort((a, b) => a.localeCompare(b));
}

function slugFromFile(rootDir, filePath) {
  const relativePath = path.relative(rootDir, filePath).split(path.sep).join("/");
  if (relativePath.endsWith("/index.mdx")) {
    return relativePath.slice(0, -"/index.mdx".length);
  }

  return relativePath.slice(0, -".mdx".length);
}

function importPathFromFile(rootDir, filePath) {
  return `./${path.relative(rootDir, filePath).split(path.sep).join("/")}`;
}

function generateManifestSource(rootDir, exportName) {
  const files = collectMdxFiles(rootDir);
  const entries = files.map((filePath) => {
    const slug = slugFromFile(rootDir, filePath);
    const importPath = importPathFromFile(rootDir, filePath);
    return `  ${JSON.stringify(slug)}: () => import(${JSON.stringify(importPath)}),`;
  });

  return `import type { ComponentType } from "react";

export type DocPageModule = {
  default: ComponentType;
  title?: string;
  description?: string;
};

export const ${exportName}: Record<string, () => Promise<DocPageModule>> = {
${entries.join("\n")}
};
`;
}

const manifests = [
  {
    rootDir: path.join(repoRoot, "src", "docs"),
    manifestPath: path.join(repoRoot, "src", "docs", "manifest.ts"),
    exportName: "docPageModules",
  },
  {
    rootDir: path.join(repoRoot, "src", "zhCN-docs"),
    manifestPath: path.join(repoRoot, "src", "zhCN-docs", "manifest.ts"),
    exportName: "zhCNDocPageModules",
  },
];

for (const manifest of manifests) {
  const source = generateManifestSource(manifest.rootDir, manifest.exportName);
  fs.writeFileSync(manifest.manifestPath, source);
}
