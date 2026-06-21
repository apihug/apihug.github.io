"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { IconButton } from "./icon-button";
import { SearchButton } from "./search";
import { Logo, LogoMark } from "./logo";

function GitHubLogo(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 20 20" {...props}>
      <path d="M10 0C4.475 0 0 4.475 0 10a9.994 9.994 0 006.838 9.488c.5.087.687-.213.687-.476 0-.237-.013-1.024-.013-1.862-2.512.463-3.162-.612-3.362-1.175-.113-.287-.6-1.175-1.025-1.412-.35-.188-.85-.65-.013-.663.788-.013 1.35.725 1.538 1.025.9 1.512 2.337 1.087 2.912.825.088-.65.35-1.088.638-1.338-2.225-.25-4.55-1.112-4.55-4.937 0-1.088.387-1.987 1.025-2.688-.1-.25-.45-1.274.1-2.65 0 0 .837-.262 2.75 1.026a9.28 9.28 0 012.5-.338c.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.024 2.75-1.024.55 1.375.2 2.4.1 2.65.637.7 1.025 1.587 1.025 2.687 0 3.838-2.337 4.688-4.562 4.938.362.312.675.912.675 1.85 0 1.337-.013 2.412-.013 2.75 0 .262.188.574.688.474A10.016 10.016 0 0020 10c0-5.525-4.475-10-10-10z" />
    </svg>
  );
}

function DocsLocaleMenu() {
  let [isOpen, setIsOpen] = useState(false);
  let triggerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setIsOpen(false);
          triggerRef.current?.focus();
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="docs-locale-menu"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1 text-sm/6 text-gray-950 dark:text-white"
      >
        Docs
        <svg
          viewBox="0 0 8 6"
          aria-hidden="true"
          className={`size-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path
            d="M1 1l3 3 3-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {isOpen && (
        <div
          className="absolute left-0 top-full z-20 pt-3"
        >
          <div
            id="docs-locale-menu"
            className="w-44 rounded-xl border border-gray-950/10 bg-white p-2 shadow-lg dark:border-white/10 dark:bg-gray-900"
          >
            <div className="grid gap-1">
              <Link
                href="/docs"
                className="rounded-lg px-3 py-2 text-sm/6 font-medium text-gray-950 hover:bg-gray-950/5 dark:text-white dark:hover:bg-white/10"
              >
                English
              </Link>
              <Link
                href="/zhCN-docs"
                className="rounded-lg px-3 py-2 text-sm/6 font-medium text-gray-950 hover:bg-gray-950/5 dark:text-white dark:hover:bg-white/10"
              >
                中文
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Header(props: React.PropsWithChildren) {
  let [navIsOpen, setNavIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-950">
      <div className="flex h-14 items-center justify-between gap-8 px-4 sm:px-6">
        <Link
          href="/"
          className="shrink-0"
          aria-label="Home"
        >
          <Logo />
        </Link>
        <div className="flex items-center gap-6 max-md:hidden">
          <SearchButton className="inline-flex items-center gap-1 rounded-full bg-gray-950/2 px-2 py-1 inset-ring inset-ring-gray-950/8 dark:bg-white/5 dark:inset-ring-white/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              className="-ml-0.5 size-4 fill-gray-600 dark:fill-gray-500"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
            <kbd className="hidden font-sans text-xs/4 text-gray-500 dark:text-gray-400 [.os-macos_&]:block">⌘K</kbd>
            <kbd className="hidden font-sans text-xs/4 text-gray-500 not-[.os-macos_&]:block dark:text-gray-400">
              Ctrl&nbsp;K
            </kbd>
          </SearchButton>
          <DocsLocaleMenu />
          <Link href="/docs/changelog" className="text-sm/6 text-gray-950 dark:text-white">
            Changelog
          </Link>
          <Link
            href="https://github.com/apihug"
            aria-label="GitHub repository"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubLogo className="size-5 fill-black/40 dark:fill-gray-400" />
          </Link>
        </div>
        <div className="flex items-center gap-2.5 md:hidden">
          <SearchButton aria-label="Search" className="inline-grid size-7 place-items-center rounded-md">
            <svg viewBox="0 0 16 16" fill="currentColor" className="size-4">
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </SearchButton>
          <IconButton aria-label="Navigation" onClick={() => setNavIsOpen(!navIsOpen)}>
            <svg viewBox="0 0 16 16" fill="currentColor" className="size-4">
              <path d="M8 2a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM8 6.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM9.5 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
            </svg>
          </IconButton>

          <Dialog
            open={navIsOpen}
            onClose={() => setNavIsOpen(false)}
            className="fixed inset-0 bg-white focus:outline-none md:hidden dark:bg-gray-950"
          >
            <DialogPanel className="size-full overflow-y-auto">
              <div className="flex h-14 items-center justify-between px-4 py-4 sm:px-6">
                <LogoMark className="h-6" />
                <IconButton aria-label="Navigation" onClick={() => setNavIsOpen(false)}>
                  <svg viewBox="0 0 16 16" fill="currentColor" className="size-4">
                    <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                  </svg>
                </IconButton>
              </div>
              <div className="grid grid-cols-1 gap-1 px-1 pb-1 sm:px-3 sm:pb-3">
                <Link
                  href="/docs"
                  className="rounded-lg px-3 py-2 text-xl/9 font-medium text-gray-950 data-active:bg-gray-950/5 dark:text-white dark:hover:bg-white/10"
                >
                  English
                </Link>
                <Link
                  href="/zhCN-docs"
                  className="rounded-lg px-3 py-2 text-xl/9 font-medium text-gray-950 data-active:bg-gray-950/5 dark:text-white dark:hover:bg-white/10"
                >
                  中文
                </Link>
                <Link
                  href="/docs/changelog"
                  className="rounded-lg px-3 py-2 text-xl/9 font-medium text-gray-950 data-active:bg-gray-950/5 dark:text-white dark:hover:bg-white/10"
                >
                  Changelog
                </Link>
                <Link
                  href="https://github.com/apihug"
                  className="rounded-lg px-3 py-2 text-xl/9 font-medium text-gray-950 data-active:bg-gray-950/5 dark:text-white dark:hover:bg-white/10"
                >
                  GitHub
                </Link>
              </div>
            </DialogPanel>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
