import fs from "node:fs";
import path from "node:path";

const sourceRoot = process.argv[2] ?? "src/pages-legacy/docs";
const targetRoot = process.argv[3] ?? "src/docs";
const resolvedSourceRoot = path.resolve(sourceRoot);
const resolvedTargetRoot = path.resolve(targetRoot);
const pluginMarketplaceHref =
  "https://plugins.jetbrains.com/plugin/23534-apihug--api-design-copilot";

function walkMdxFiles(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap((entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return walkMdxFiles(fullPath);
      }
      return entry.name.endsWith(".mdx") ? [fullPath] : [];
    });
}

function convertContent(content) {
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!fmMatch) {
    return content;
  }

  const yaml = fmMatch[1];
  let body = fmMatch[2];

  const titleMatch = yaml.match(/^title:\s*["']?(.+?)["']?\s*$/m);
  const descMatch = yaml.match(/^description:\s*["']?(.+?)["']?\s*$/m);
  const title = titleMatch ? titleMatch[1].trim() : "Untitled";
  const description = descMatch ? descMatch[1].trim() : "";

  body = body.replace(
    /^import\s+\{[^}]*\}\s+from\s+['"]@\/components\/(Tip|Steps)[^'"]*['"];?\s*\r?\n?/gm,
    "",
  );

  body = body.replace(
    /<a target="_blank" href="https:\/\/search\.maven\.org\/artifact\/com\.apihug\/([^"]+)"><img[\s\S]*?<\/a>/g,
    (_match, artifactId) => `[Maven Central](https://search.maven.org/artifact/com.apihug/${artifactId})`,
  );

  body = body.replace(
    /<a target="_blank" href="https:\/\/search\.maven\.org\/artifact\/com\.apihug\/([^"]+)">\s*<img[\s\S]*?<\/a>/g,
    (_match, artifactId) => `[Maven Central](https://search.maven.org/artifact/com.apihug/${artifactId})`,
  );

  body = body.replace(
    /<div>\s*<iframe[\s\S]*?src="https:\/\/plugins\.jetbrains\.com\/embeddable\/card\/23534"[\s\S]*?<\/iframe>\s*<\/div>/g,
    "[JetBrains Marketplace](https://plugins.jetbrains.com/plugin/23534-apihug--api-design-copilot)",
  );

  body = body.replace(
    /<div>\s*<iframe[\s\S]*?src="https:\/\/plugins\.jetbrains\.com\/embeddable\/install\/23534"[\s\S]*?<\/iframe>\s*<\/div>/g,
    "[JetBrains Marketplace](https://plugins.jetbrains.com/plugin/23534-apihug--api-design-copilot)",
  );

  body = body.replace(
    /<a target="_blank" href="https:\/\/plugins\.jetbrains\.com\/plugin\/23534-apihug--api-design-copilot"><img[\s\S]*?<\/a>/g,
    `[JetBrains Marketplace](${pluginMarketplaceHref})`,
  );

  body = body.replace(
    /<a target="_blank" href="https:\/\/plugins\.jetbrains\.com\/plugin\/23534-apihug--api-design-copilot">\s*<img[\s\S]*?<\/a>/g,
    `[JetBrains Marketplace](${pluginMarketplaceHref})`,
  );

  let header = `export const title = ${JSON.stringify(title)};\n`;
  if (description) {
    header += `export const description =\n  ${JSON.stringify(description)};\n`;
  }

  return `${header}\n${body}`;
}

if (!fs.existsSync(resolvedSourceRoot)) {
  console.error(`Source root does not exist: ${resolvedSourceRoot}`);
  process.exit(1);
}

const sourceFiles = walkMdxFiles(resolvedSourceRoot);
let converted = 0;
let errors = 0;

for (const sourceFile of sourceFiles) {
  const relPath = path.relative(resolvedSourceRoot, sourceFile);
  const targetFile = path.join(resolvedTargetRoot, relPath);

  try {
    const content = fs.readFileSync(sourceFile, "utf8");
    const convertedContent = convertContent(content);

    fs.mkdirSync(path.dirname(targetFile), { recursive: true });
    fs.writeFileSync(targetFile, convertedContent);
    converted++;
    console.log(`OK: ${relPath}`);
  } catch (error) {
    console.error(`ERROR: ${relPath} - ${error.message}`);
    errors++;
  }
}

console.log(`\nDone: ${converted} converted, ${errors} errors`);
