import type { TOCEntry } from "@/components/table-of-contents";
import fs from "node:fs/promises";
import path from "node:path";
import React from "react";
import index from "./index";

/**
 * Get a zhCN doc page by its slug path (e.g., "start/what-is-apihug" or "idea/001-install-plugin")
 */
export async function getZhCNDocPageBySlug(
  slug: string,
): Promise<null | { Component: React.FC; title: string; description: string }> {
  try {
    let filePath = path.join(process.cwd(), "./src/zhCN-docs", `${slug}.mdx`);
    if (!(await fs.stat(filePath).catch(() => false))) {
      let indexPath = path.join(process.cwd(), "./src/zhCN-docs", slug, "index.mdx");
      if (await fs.stat(indexPath).catch(() => false)) {
        filePath = indexPath;
      } else {
        return null;
      }
    }

    let module = await import(`../../../zhCN-docs/${slug}.mdx`).catch(() => null);
    if (!module && filePath !== path.join(process.cwd(), "./src/zhCN-docs", `${slug}.mdx`)) {
      module = await import(`../../../zhCN-docs/${slug}/index.mdx`).catch(() => null);
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
    console.error(`Error loading zhCN doc page: ${slug}`, e);
    return null;
  }
}

/**
 * Get all zhCN doc page slugs for static generation
 */
export async function getZhCNDocPageSlugs(): Promise<string[][]> {
  let docsDir = path.join(process.cwd(), "./src/zhCN-docs");
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
 * Generate table of contents from a zhCN MDX file's markdown content
 */
export async function generateZhCNTableOfContents(slug: string): Promise<TOCEntry[]> {
  let filePath = path.join(process.cwd(), "./src/zhCN-docs", `${slug}.mdx`);
  if (!(await fs.stat(filePath).catch(() => false))) {
    let indexPath = path.join(process.cwd(), "./src/zhCN-docs", slug, "index.mdx");
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
 * Look up the section name and title for a given zhCN slug
 */
export function getZhCNSectionAndTitleBySlug(
  slug: string,
): { section: string; title: string } | null {
  let currentPath = `/zhCN-docs/${slug}`;
  for (let [section, entries] of Object.entries(index)) {
    for (let [title, entryPath, children] of entries) {
      if (entryPath === currentPath) {
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
