"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

const INDEX_NAME =
  process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ?? "apihug_github_io_k5tocsg7lu_pages";
const API_KEY = process.env.NEXT_PUBLIC_ALGOLIA_API_KEY ?? "325ded393996e354815124ed7d764f23";
const APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? "K5TOCSG7LU";
const HITS_PER_PAGE = 8;

type SearchContextValue = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onInput: (event: KeyboardEvent | { key: string }) => void;
};

type AlgoliaSnippet = {
  value: string;
};

type RawCrawlerHit = {
  objectID: string;
  url: string;
  path?: string;
  title?: string;
  headline?: string;
  description?: string;
  content?: string;
  _snippetResult?: {
    title?: AlgoliaSnippet;
    headline?: AlgoliaSnippet;
    description?: AlgoliaSnippet;
    content?: AlgoliaSnippet;
  };
};

type AlgoliaResponse = {
  hits: RawCrawlerHit[];
};

type SearchResult = {
  id: string;
  href: string;
  title: string;
  section: string;
  snippet: string;
  pathLabel: string;
};

const SearchContext = createContext<SearchContextValue>({
  isOpen: false,
  onOpen: () => {},
  onClose: () => {},
  onInput: () => {},
});

export function SearchProvider({ children }: React.PropsWithChildren) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const deferredQuery = useDeferredValue(query);

  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
    setInitialQuery("");
    setQuery("");
    setResults([]);
    setActiveIndex(0);
    setErrorMessage("");
    setIsLoading(false);
  }, []);

  const onInput = useCallback((event: KeyboardEvent | { key: string }) => {
    if (!event.key || event.key.length !== 1) {
      setInitialQuery("");
      setIsOpen(true);
      return;
    }

    setInitialQuery(event.key);
    setIsOpen(true);
  }, []);

  useSearchKeyboardEvents({
    isOpen,
    onOpen,
    onClose,
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setQuery(initialQuery);
    setActiveIndex(0);
  }, [initialQuery, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    inputRef.current?.focus();
    inputRef.current?.select();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const trimmedQuery = deferredQuery.trim();

    if (!trimmedQuery) {
      setResults([]);
      setActiveIndex(0);
      setIsLoading(false);
      setErrorMessage("");
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await fetch(`https://${APP_ID}-dsn.algolia.net/1/indexes/${INDEX_NAME}/query`, {
          method: "POST",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            "X-Algolia-Application-Id": APP_ID,
            "X-Algolia-API-Key": API_KEY,
          },
          body: JSON.stringify({
            params: new URLSearchParams({
              query: trimmedQuery,
              hitsPerPage: String(HITS_PER_PAGE),
              attributesToRetrieve: [
                "url",
                "path",
                "title",
                "headline",
                "description",
                "content",
                "objectID",
              ].join(","),
              attributesToSnippet: ["headline:12", "description:18", "content:20", "title:12"].join(","),
            }).toString(),
          }),
        });

        if (!response.ok) {
          throw new Error(`Algolia search failed with ${response.status}`);
        }

        const payload = (await response.json()) as AlgoliaResponse;
        const nextResults = payload.hits.map(normalizeHit);
        setResults(nextResults);
        setActiveIndex(0);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setResults([]);
        setErrorMessage("Search is temporarily unavailable.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 120);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [deferredQuery, isOpen]);

  const navigateToResult = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [onClose, router],
  );

  const searchContext = useMemo(
    () => ({
      isOpen,
      onOpen,
      onClose,
      onInput,
    }),
    [isOpen, onOpen, onClose, onInput],
  );

  return (
    <>
      <link rel="preconnect" href={`https://${APP_ID}-dsn.algolia.net`} crossOrigin="anonymous" />
      <SearchContext.Provider value={searchContext}>{children}</SearchContext.Provider>
      {isOpen &&
        createPortal(
          <Dialog open={isOpen} onClose={onClose} className="relative z-[200]">
            <div className="fixed inset-0 bg-gray-950/20 backdrop-blur-sm" aria-hidden="true" />
            <div className="fixed inset-0 overflow-y-auto p-4 sm:p-6 md:p-[10vh]">
              <div className="mx-auto flex min-h-full w-full max-w-3xl items-start">
                <DialogPanel className="w-full overflow-hidden rounded-[1.75rem] border border-gray-950/10 bg-white shadow-[0_32px_80px_-32px_rgba(15,23,42,0.45)]">
                  <div className="flex items-center gap-3 border-b border-gray-950/8 px-4 py-3 sm:px-5">
                    <SearchGlyph className="size-5 text-gray-400" />
                    <label htmlFor="site-search" className="sr-only">
                      Search documentation
                    </label>
                    <input
                      id="site-search"
                      ref={inputRef}
                      type="search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      onKeyDown={(event) => {
                        if (!results.length) {
                          return;
                        }

                        if (event.key === "ArrowDown") {
                          event.preventDefault();
                          setActiveIndex((current) => (current + 1) % results.length);
                        } else if (event.key === "ArrowUp") {
                          event.preventDefault();
                          setActiveIndex((current) => (current - 1 + results.length) % results.length);
                        } else if (event.key === "Enter") {
                          event.preventDefault();
                          navigateToResult(results[activeIndex].href);
                        }
                      }}
                      placeholder="Search documentation"
                      className="min-w-0 flex-1 border-0 bg-transparent text-sm/6 text-gray-950 outline-none placeholder:text-gray-400"
                    />
                    {isLoading ? (
                      <Spinner className="size-5 text-sky-500" />
                    ) : (
                      <span className="hidden rounded-md border border-gray-950/10 px-2 py-1 text-[11px]/4 font-medium tracking-wide text-gray-500 sm:inline">
                        Esc
                      </span>
                    )}
                  </div>

                  <div className="max-h-[min(60vh,38rem)] overflow-y-auto">
                    {!query.trim() ? (
                      <div className="px-4 py-8 sm:px-5">
                        <p className="text-sm/6 font-medium text-gray-950">Start typing to search the docs</p>
                        <p className="mt-1 text-sm/6 text-gray-500">
                          Try topics like <span className="font-medium text-gray-700">quick start</span>,{" "}
                          <span className="font-medium text-gray-700">protobuf</span>,{" "}
                          <span className="font-medium text-gray-700">spring api</span>, or{" "}
                          <span className="font-medium text-gray-700">skills</span>.
                        </p>
                      </div>
                    ) : errorMessage ? (
                      <div className="px-4 py-8 sm:px-5">
                        <p className="text-sm/6 font-medium text-gray-950">{errorMessage}</p>
                      </div>
                    ) : results.length === 0 && !isLoading ? (
                      <div className="px-4 py-8 sm:px-5">
                        <p className="text-sm/6 font-medium text-gray-950">No results</p>
                        <p className="mt-1 text-sm/6 text-gray-500">
                          No results for <span className="font-medium text-gray-700">{query.trim()}</span>.
                        </p>
                      </div>
                    ) : (
                      <div className="px-2 py-3 sm:px-3">
                        <p className="px-2 pb-2 text-xs/5 font-semibold tracking-wide text-gray-400 uppercase">
                          Search results
                        </p>
                        <div role="listbox" aria-label="Search results" className="space-y-2">
                          {results.map((result, index) => (
                            <Link
                              key={result.id}
                              href={result.href}
                              role="option"
                              aria-selected={activeIndex === index}
                              onClick={(event) => {
                                event.preventDefault();
                                navigateToResult(result.href);
                              }}
                              onMouseEnter={() => setActiveIndex(index)}
                              className={clsx(
                                "group flex items-start gap-3 rounded-2xl px-3 py-3 transition",
                                activeIndex === index ? "bg-sky-500 text-white" : "bg-gray-50 text-gray-950 hover:bg-gray-100",
                              )}
                            >
                              <div
                                className={clsx(
                                  "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border",
                                  activeIndex === index
                                    ? "border-white/20 bg-white/10 text-white"
                                    : "border-gray-950/8 bg-white text-gray-400",
                                )}
                              >
                                <SearchResultGlyph className="size-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 text-[11px]/5 font-semibold tracking-wide uppercase">
                                  <span className={activeIndex === index ? "text-white/75" : "text-gray-400"}>
                                    {result.section}
                                  </span>
                                  <span className={activeIndex === index ? "text-white/40" : "text-gray-300"}>/</span>
                                  <span className={activeIndex === index ? "text-white/75" : "text-gray-400"}>
                                    {result.pathLabel}
                                  </span>
                                </div>
                                <p className="mt-1 text-sm/6 font-semibold">{result.title}</p>
                                <p
                                  className={clsx(
                                    "mt-1 text-sm/6",
                                    activeIndex === index ? "text-white/80" : "text-gray-600",
                                  )}
                                >
                                  {renderHighlightedText(result.snippet)}
                                </p>
                              </div>
                              <SearchArrow
                                className={clsx(
                                  "mt-1 size-4 shrink-0",
                                  activeIndex === index ? "text-white" : "text-gray-300 group-hover:text-gray-400",
                                )}
                              />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end border-t border-gray-950/8 px-4 py-3 sm:px-5">
                    <a
                      href={`https://www.algolia.com/ref/docsearch/?utm_source=${window.location.hostname}&utm_medium=referral&utm_content=powered_by&utm_campaign=docsearch`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs/5 font-medium text-gray-400 transition hover:text-gray-600"
                    >
                      <span>Search by</span>
                      <AlgoliaLogo className="h-4 w-auto shrink-0" />
                    </a>
                  </div>
                </DialogPanel>
              </div>
            </div>
          </Dialog>,
          document.body,
        )}
    </>
  );
}

function normalizeHit(hit: RawCrawlerHit): SearchResult {
  const parsedUrl = parseResultUrl(hit.url);
  const title = hit.headline ?? hit.title ?? parsedUrl.pathLabel;
  const snippet =
    hit._snippetResult?.headline?.value ??
    hit._snippetResult?.description?.value ??
    hit._snippetResult?.content?.value ??
    hit.description ??
    hit.content ??
    title;

  return {
    id: hit.objectID,
    href: parsedUrl.href,
    title,
    section: getSectionLabel(hit.path ?? parsedUrl.pathname),
    snippet,
    pathLabel: parsedUrl.pathLabel,
  };
}

function parseResultUrl(rawUrl: string) {
  const url = new URL(rawUrl, window.location.origin);
  const hash = url.hash === "#content-wrapper" || url.hash === "#header" ? "" : url.hash;

  return {
    href: `${url.pathname}${hash}`,
    pathname: url.pathname,
    pathLabel: url.pathname === "/" ? "home" : url.pathname.replace(/^\/+/, ""),
  };
}

function getSectionLabel(pathname: string) {
  if (pathname === "/") {
    return "Home";
  }

  if (pathname.startsWith("/zhCN-docs")) {
    return "中文";
  }

  if (pathname.startsWith("/docs")) {
    return "English";
  }

  return "Site";
}

function renderHighlightedText(value: string) {
  const segments = value.split(/(<em>.*?<\/em>)/g).filter(Boolean);

  return segments.map((segment, index) => {
    if (segment.startsWith("<em>") && segment.endsWith("</em>")) {
      return (
        <mark key={index} className="bg-transparent font-semibold text-current underline decoration-2 underline-offset-3">
          {segment.slice(4, -5)}
        </mark>
      );
    }

    return <span key={index}>{segment}</span>;
  });
}

export function SearchButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const searchButtonRef = useRef<HTMLButtonElement | null>(null);
  const { onOpen, onInput } = useContext(SearchContext);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (searchButtonRef.current !== document.activeElement) {
        return;
      }

      if (/[a-zA-Z0-9]/.test(String.fromCharCode(event.keyCode))) {
        onInput(event);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onInput]);

  return (
    <button type="button" ref={searchButtonRef} onClick={onOpen} {...props}>
      {children}
    </button>
  );
}

function useSearchKeyboardEvents({
  isOpen,
  onOpen,
  onClose,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        (event.key === "Escape" && isOpen) ||
        (event.key === "k" && (event.metaKey || event.ctrlKey) && !event.shiftKey) ||
        (!isEditingContent(event) && event.key === "/" && !isOpen)
      ) {
        event.preventDefault();

        if (isOpen) {
          onClose();
        } else {
          onOpen();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, onOpen]);
}

function isEditingContent(event: KeyboardEvent) {
  const element = event.target as HTMLElement | null;

  if (!element) {
    return false;
  }

  const tagName = element.tagName;
  return element.isContentEditable || tagName === "INPUT" || tagName === "SELECT" || tagName === "TEXTAREA";
}

function SearchGlyph(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M14 14l4 4M16 8.5a7.5 7.5 0 1 1-15 0a7.5 7.5 0 0 1 15 0Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchResultGlyph(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6 5.5h8M6 10h8M6 14.5h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect x="3" y="3" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function SearchArrow(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Spinner(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={clsx("animate-spin", props.className)}>
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
      <path
        d="M17 10a7 7 0 0 0-7-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AlgoliaLogo(props: React.ComponentProps<"svg">) {
  return (
    <svg
      width="77"
      height="19"
      aria-label="Algolia"
      role="img"
      viewBox="0 0 2196.2 500"
      fill="none"
      {...props}
    >
      <defs>
        <style>{".cls-1,.cls-2{fill:#003dff;}.cls-2{fill-rule:evenodd;}"}</style>
      </defs>
      <path
        className="cls-2"
        d="M1070.38,275.3V5.91c0-3.63-3.24-6.39-6.82-5.83l-50.46,7.94c-2.87,.45-4.99,2.93-4.99,5.84l.17,273.22c0,12.92,0,92.7,95.97,95.49,3.33,.1,6.09-2.58,6.09-5.91v-40.78c0-2.96-2.19-5.51-5.12-5.84-34.85-4.01-34.85-47.57-34.85-54.72Z"
      />
      <rect className="cls-1" x="1845.88" y="104.73" width="62.58" height="277.9" rx="5.9" ry="5.9" />
      <path
        className="cls-2"
        d="M1851.78,71.38h50.77c3.26,0,5.9-2.64,5.9-5.9V5.9c0-3.62-3.24-6.39-6.82-5.83l-50.77,7.95c-2.87,.45-4.99,2.92-4.99,5.83v51.62c0,3.26,2.64,5.9,5.9,5.9Z"
      />
      <path
        className="cls-2"
        d="M1764.03,275.3V5.91c0-3.63-3.24-6.39-6.82-5.83l-50.46,7.94c-2.87,.45-4.99,2.93-4.99,5.84l.17,273.22c0,12.92,0,92.7,95.97,95.49,3.33,.1,6.09-2.58,6.09-5.91v-40.78c0-2.96-2.19-5.51-5.12-5.84-34.85-4.01-34.85-47.57-34.85-54.72Z"
      />
      <path
        className="cls-2"
        d="M1631.95,142.72c-11.14-12.25-24.83-21.65-40.78-28.31-15.92-6.53-33.26-9.85-52.07-9.85-18.78,0-36.15,3.17-51.92,9.85-15.59,6.66-29.29,16.05-40.76,28.31-11.47,12.23-20.38,26.87-26.76,44.03-6.38,17.17-9.24,37.37-9.24,58.36,0,20.99,3.19,36.87,9.55,54.21,6.38,17.32,15.14,32.11,26.45,44.36,11.29,12.23,24.83,21.62,40.6,28.46,15.77,6.83,40.12,10.33,52.4,10.48,12.25,0,36.78-3.82,52.7-10.48,15.92-6.68,29.46-16.23,40.78-28.46,11.29-12.25,20.05-27.04,26.25-44.36,6.22-17.34,9.24-33.22,9.24-54.21,0-20.99-3.34-41.19-10.03-58.36-6.38-17.17-15.14-31.8-26.43-44.03Zm-44.43,163.75c-11.47,15.75-27.56,23.7-48.09,23.7-20.55,0-36.63-7.8-48.1-23.7-11.47-15.75-17.21-34.01-17.21-61.2,0-26.89,5.59-49.14,17.06-64.87,11.45-15.75,27.54-23.52,48.07-23.52,20.55,0,36.63,7.78,48.09,23.52,11.47,15.57,17.36,37.98,17.36,64.87,0,27.19-5.72,45.3-17.19,61.2Z"
      />
      <path
        className="cls-2"
        d="M894.42,104.73h-49.33c-48.36,0-90.91,25.48-115.75,64.1-14.52,22.58-22.99,49.63-22.99,78.73,0,44.89,20.13,84.92,51.59,111.1,2.93,2.6,6.05,4.98,9.31,7.14,12.86,8.49,28.11,13.47,44.52,13.47,1.23,0,2.46-.03,3.68-.09,.36-.02,.71-.05,1.07-.07,.87-.05,1.75-.11,2.62-.2,.34-.03,.68-.08,1.02-.12,.91-.1,1.82-.21,2.73-.34,.21-.03,.42-.07,.63-.1,32.89-5.07,61.56-30.82,70.9-62.81v57.83c0,3.26,2.64,5.9,5.9,5.9h50.42c3.26,0,5.9-2.64,5.9-5.9V110.63c0-3.26-2.64-5.9-5.9-5.9h-56.32Zm0,206.92c-12.2,10.16-27.97,13.98-44.84,15.12-.16,.01-.33,.03-.49,.04-1.12,.07-2.24,.1-3.36,.1-42.24,0-77.12-35.89-77.12-79.37,0-10.25,1.96-20.01,5.42-28.98,11.22-29.12,38.77-49.74,71.06-49.74h49.33v142.83Z"
      />
      <path
        className="cls-2"
        d="M2133.97,104.73h-49.33c-48.36,0-90.91,25.48-115.75,64.1-14.52,22.58-22.99,49.63-22.99,78.73,0,44.89,20.13,84.92,51.59,111.1,2.93,2.6,6.05,4.98,9.31,7.14,12.86,8.49,28.11,13.47,44.52,13.47,1.23,0,2.46-.03,3.68-.09,.36-.02,.71-.05,1.07-.07,.87-.05,1.75-.11,2.62-.2,.34-.03,.68-.08,1.02-.12,.91-.1,1.82-.21,2.73-.34,.21-.03,.42-.07,.63-.1,32.89-5.07,61.56-30.82,70.9-62.81v57.83c0,3.26,2.64,5.9,5.9,5.9h50.42c3.26,0,5.9-2.64,5.9-5.9V110.63c0-3.26-2.64-5.9-5.9-5.9h-56.32Zm0,206.92c-12.2,10.16-27.97,13.98-44.84,15.12-.16,.01-.33,.03-.49,.04-1.12,.07-2.24,.1-3.36,.1-42.24,0-77.12-35.89-77.12-79.37,0-10.25,1.96-20.01,5.42-28.98,11.22-29.12,38.77-49.74,71.06-49.74h49.33v142.83Z"
      />
      <path
        className="cls-2"
        d="M1314.05,104.73h-49.33c-48.36,0-90.91,25.48-115.75,64.1-11.79,18.34-19.6,39.64-22.11,62.59-.58,5.3-.88,10.68-.88,16.14s.31,11.15,.93,16.59c4.28,38.09,23.14,71.61,50.66,94.52,2.93,2.6,6.05,4.98,9.31,7.14,12.86,8.49,28.11,13.47,44.52,13.47h0c17.99,0,34.61-5.93,48.16-15.97,16.29-11.58,28.88-28.54,34.48-47.75v50.26h-.11v11.08c0,21.84-5.71,38.27-17.34,49.36-11.61,11.08-31.04,16.63-58.25,16.63-11.12,0-28.79-.59-46.6-2.41-2.83-.29-5.46,1.5-6.27,4.22l-12.78,43.11c-1.02,3.46,1.27,7.02,4.83,7.53,21.52,3.08,42.52,4.68,54.65,4.68,48.91,0,85.16-10.75,108.89-32.21,21.48-19.41,33.15-48.89,35.2-88.52V110.63c0-3.26-2.64-5.9-5.9-5.9h-56.32Zm0,64.1s.65,139.13,0,143.36c-12.08,9.77-27.11,13.59-43.49,14.7-.16,.01-.33,.03-.49,.04-1.12,.07-2.24,.1-3.36,.1-1.32,0-2.63-.03-3.94-.1-40.41-2.11-74.52-37.26-74.52-79.38,0-10.25,1.96-20.01,5.42-28.98,11.22-29.12,38.77-49.74,71.06-49.74h49.33Z"
      />
      <path
        className="cls-1"
        d="M249.83,0C113.3,0,2,110.09,.03,246.16c-2,138.19,110.12,252.7,248.33,253.5,42.68,.25,83.79-10.19,120.3-30.03,3.56-1.93,4.11-6.83,1.08-9.51l-23.38-20.72c-4.75-4.21-11.51-5.4-17.36-2.92-25.48,10.84-53.17,16.38-81.71,16.03-111.68-1.37-201.91-94.29-200.13-205.96,1.76-110.26,92-199.41,202.67-199.41h202.69V407.41l-115-102.18c-3.72-3.31-9.42-2.66-12.42,1.31-18.46,24.44-48.53,39.64-81.93,37.34-46.33-3.2-83.87-40.5-87.34-86.81-4.15-55.24,39.63-101.52,94-101.52,49.18,0,89.68,37.85,93.91,85.95,.38,4.28,2.31,8.27,5.52,11.12l29.95,26.55c3.4,3.01,8.79,1.17,9.63-3.3,2.16-11.55,2.92-23.58,2.07-35.92-4.82-70.34-61.8-126.93-132.17-131.26-80.68-4.97-148.13,58.14-150.27,137.25-2.09,77.1,61.08,143.56,138.19,145.26,32.19,.71,62.03-9.41,86.14-26.95l150.26,133.2c6.44,5.71,16.61,1.14,16.61-7.47V9.48C499.66,4.25,495.42,0,490.18,0H249.83Z"
      />
    </svg>
  );
}
