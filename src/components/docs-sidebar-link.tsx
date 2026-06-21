"use client";

import { NavListLink } from "@/components/nav-list";
import { usePathname } from "next/navigation";

function normalizePath(value: string | null | undefined) {
  if (!value) return "/";
  let normalized = value.replace(/\/+$/, "");
  return normalized === "" ? "/" : normalized;
}

export function DocsSidebarLink({ title, path, nested = false }: { title: string; path: string; nested?: boolean }) {
  let pathname = usePathname();
  let currentPath = normalizePath(pathname);
  let targetPath = normalizePath(path);

  return (
    <NavListLink
      aria-current={currentPath === targetPath ? "page" : undefined}
      href={path}
      nested={nested}
    >
      {title}
    </NavListLink>
  );
}
