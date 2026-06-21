import type { TOCEntry } from "@/components/table-of-contents";
import fs from "node:fs/promises";
import path from "node:path";
import React from "react";
import { docPageModules } from "../../../docs/manifest";
import index from "./index";

/**
 * Get a doc page by its slug path (e.g., "start/what-is-apihug" or "idea/001-install-plugin")
 */
export async function getDocPageBySlug(
  slug: string,
): Promise<null | { Component: React.ComponentType; title: string; description: string }> {
  try {
    const loadModule = docPageModules[slug];
    if (!loadModule) {
      return null;
    }

    const module = await loadModule().catch(() => null);
    if (!module || !module.default) {
      return null;
    }

    return {
      Component: module.default,
      title: module.title ?? "",
      description: module.description ?? "",
    };
  } catch (error) {
    console.error(`Error loading doc page: ${slug}`, error);
    return null;
  }
}

/**
 * Get all doc page slugs for static generation
 */
export async function getDocPageSlugs(): Promise<string[][]> {
  return Object.keys(docPageModules).map((slug) => slug.split("/"));
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
