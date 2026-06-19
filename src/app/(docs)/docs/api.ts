import type { TOCEntry } from "@/components/table-of-contents";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import index from "./index";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get a doc page by its slug path (e.g., "start/what-is-apihug" or "idea/001-install-plugin")
 */
export async function getDocPageBySlug(
  slug: string,
): Promise<null | { Component: React.FC; title: string; description: string }> {
  try {
    let filePath = path.join(process.cwd(), "./src/docs", `${slug}.mdx`);
    if (!(await fs.stat(filePath).catch(() => false))) {
      // Try slug/index.mdx for directory-based index pages
      let indexPath = path.join(process.cwd(), "./src/docs", slug, "index.mdx");
      if (await fs.stat(indexPath).catch(() => false)) {
        filePath = indexPath;
      } else {
        return null;
      }
    }

    // Resolve the import path relative to this file
    let docsDir = path.join(process.cwd(), "./src/docs");
    let relativeImport = path.relative(path.join(__dirname, ".."), filePath).replace(/\\/g, "/");

    // Dynamic import of MDX files
    let module = await import(`../../../docs/${slug}.mdx`).catch(() => null);
    if (!module && filePath !== path.join(process.cwd(), "./src/docs", `${slug}.mdx`)) {
      // For index files, import with the /index suffix
      module = await import(`../../../docs/${slug}/index.mdx`).catch(() => null);
    }
    if (!module || !module.default) {
      return null;
    }

    return {
      Component: module.default,
      title: module.title ?? "",
      description: module.description ?? "",
    };
  } catch (e) {
    console.error(`Error loading doc page: ${slug}`, e);
    return null;
  }
}

/**
 * Get all doc page slugs for static generation
 */
export async function getDocPageSlugs(): Promise<string[][]> {
  let docsDir = path.join(process.cwd(), "./src/docs");
  if (!(await fs.stat(docsDir).catch(() => false))) {
    return [];
  }

  let slugs: string[][] = [];
  await collectMdxSlugs(docsDir, docsDir, slugs);
  return slugs;
}

async function collectMdxSlugs(dir: string, baseDir: string, result: string[][]) {
  let entries = await fs.readdir(dir, { withFileTypes: true });
  for (let entry of entries) {
    let fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectMdxSlugs(fullPath, baseDir, result);
    } else if (entry.name.endsWith(".mdx")) {
      let relativePath = path.relative(baseDir, fullPath);
      let slugParts = relativePath.replace(/\.mdx$/, "").split(path.sep);
      // For index.mdx files, strip the 'index' part: spec/index → spec
      if (slugParts[slugParts.length - 1] === "index") {
        slugParts.pop();
      }
      if (slugParts.length > 0) {
        result.push(slugParts);
      }
    }
  }
}

/**
 * Generate table of contents from an MDX file's markdown content
 */
export async function generateTableOfContents(slug: string): Promise<TOCEntry[]> {
  let filePath = path.join(process.cwd(), "./src/docs", `${slug}.mdx`);
  if (!(await fs.stat(filePath).catch(() => false))) {
    let indexPath = path.join(process.cwd(), "./src/docs", slug, "index.mdx");
    if (await fs.stat(indexPath).catch(() => false)) {
      filePath = indexPath;
    } else {
      return [];
    }
  }

  let markdown = await fs.readFile(filePath, "utf8");
  return generateTableOfContentsFromMarkdown(markdown);
}

export function generateTableOfContentsFromMarkdown(markdown: string): TOCEntry[] {
  let headings = [
    ...markdown.matchAll(/^(#+)\s+(.+)$|^<h([1-6])(?:\s+[^>]*\bid=["'](.*?)["'][^>]*)?>(.*?)<\/h\3>/gm),
  ].map((match) => {
    let level: number;
    let text: string;
    let slug: string | undefined;

    if (match[1]) {
      level = match[1].length;
      text = match[2].trim().replaceAll("\\", "");
    } else {
      level = parseInt(match[3], 10);
      text = match[5].trim().replaceAll("\\", "");
      if (match[4]) {
        slug = `#${match[4]}`;
      }
    }

    slug ??= `#${text
      .replace(/`([^`]+)`/g, "$1")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase()}`;

    return { level, text, slug, children: [] as TOCEntry[] };
  });

  let toc: TOCEntry[] = [];
  let stack: TOCEntry[] = [{ level: 0, text: "", slug: "", children: toc }];

  for (let heading of headings) {
    while (stack[stack.length - 1].level >= heading.level) stack.pop();
    stack[stack.length - 1].children.push(heading);
    stack.push(heading);
  }

  return toc;
}

/**
 * Look up the section name and title for a given slug
 */
export function getSectionAndTitleBySlug(slug: string): { section: string; title: string } | null {
  let currentPath = `/docs/${slug}`;
  for (let [section, entries] of Object.entries(index)) {
    for (let [title, path, children] of entries) {
      if (path === currentPath) {
        return { section, title };
      }

      if (Array.isArray(children)) {
        for (let [childTitle, childPath] of children) {
          if (childPath === currentPath) {
            return { section, title: childTitle };
          }
        }
      }
    }
  }
  return null;
}
