"use client";

import { NavList, NavListHeading, NavListItem, NavListItems } from "@/components/nav-list";
import { usePathname } from "next/navigation";
import index from "../app/(docs)/docs/index";
import zhIndex from "../app/(docs)/zhCN-docs/index";
import { DocsSidebarLink } from "./docs-sidebar-link";

export function DocsSidebar() {
  let pathname = usePathname();
  let navIndex = pathname.startsWith("/zhCN-docs") ? zhIndex : index;

  return (
    <nav className="flex flex-col gap-8">
      {Object.entries(navIndex).map(([category, entries]) => (
        <NavList key={category} data-autoscroll>
          <NavListHeading>{category}</NavListHeading>
          <NavListItems>
            {entries.map(([title, path, children]) => (
              <NavListItem key={path}>
                <DocsSidebarLink title={title} path={path} />

                {Array.isArray(children) && children.length > 0 && (
                  <NavListItems nested>
                    {children.map(([childTitle, childPath]) => (
                      <NavListItem key={childPath}>
                        <DocsSidebarLink title={childTitle} path={childPath} nested />
                      </NavListItem>
                    ))}
                  </NavListItems>
                )}
              </NavListItem>
            ))}
          </NavListItems>
        </NavList>
      ))}
    </nav>
  );
}
