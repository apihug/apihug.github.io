"use client";

import { DocSearchModal } from "@docsearch/react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

const INDEX_NAME = "apihug";
const API_KEY = "5fc87cef58bb80203d2207578309fab6";
const APP_ID = "KNPXZI5B0M";

const SearchContext = createContext<any>({});

export function SearchProvider({ children }: React.PropsWithChildren) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState("");

  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const onInput = useCallback(
    (e: any) => {
      setIsOpen(true);
      setInitialQuery(e.key);
    },
    [setIsOpen, setInitialQuery],
  );

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen,
    onClose,
  });

  let searchContext = useMemo(
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
          <DocSearchModal
            initialQuery={initialQuery}
            initialScrollY={window.scrollY}
            placeholder="Search documentation"
            onClose={onClose}
            indexName={INDEX_NAME}
            apiKey={API_KEY}
            appId={APP_ID}
            navigator={{
              navigate({ itemUrl }) {
                setIsOpen(false);
                router.push(itemUrl);
              },
            }}
            hitComponent={Hit}
            transformItems={(items) => {
              return items.map((item, index) => {
                const a = document.createElement("a");
                a.href = item.url;

                const hash = a.hash === "#content-wrapper" || a.hash === "#header" ? "" : a.hash;

                return {
                  ...item,
                  url: `${a.pathname}${hash}`,
                  __is_result: () => true,
                  __is_parent: () => item.type === "lvl1" && items.length > 1 && index === 0,
                  __is_child: () =>
                    item.type !== "lvl1" && items.length > 1 && items[0].type === "lvl1" && index !== 0,
                  __is_first: () => index === 1,
                  __is_last: () => index === items.length - 1 && index !== 0,
                };
              });
            }}
          />,
          document.body,
        )}
    </>
  );
}

function Hit({ hit, children }: { hit: any; children: React.ReactNode }) {
  return (
    <Link
      href={hit.url}
      className={clsx({
        "DocSearch-Hit--Result": hit.__is_result?.(),
        "DocSearch-Hit--Parent": hit.__is_parent?.(),
        "DocSearch-Hit--FirstChild": hit.__is_first?.(),
        "DocSearch-Hit--LastChild": hit.__is_last?.(),
        "DocSearch-Hit--Child": hit.__is_child?.(),
      })}
    >
      {children}
    </Link>
  );
}

export function SearchButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  let searchButtonRef = useRef(null);
  let { onOpen, onInput } = useContext(SearchContext);

  useEffect(() => {
    // @ts-ignore
    function onKeyDown(event) {
      if (searchButtonRef && searchButtonRef.current === document.activeElement && onInput) {
        if (/[a-zA-Z0-9]/.test(String.fromCharCode(event.keyCode))) {
          onInput(event);
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onInput, searchButtonRef]);

  return (
    <button type="button" ref={searchButtonRef} onClick={onOpen} {...props}>
      {children}
    </button>
  );
}

function useDocSearchKeyboardEvents({
  isOpen,
  onOpen,
  onClose,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      function open() {
        if (!document.body.classList.contains("DocSearch--active")) {
          onOpen();
        }
      }

      if (
        (event.keyCode === 27 && isOpen) ||
        (event.key === "k" && (event.metaKey || event.ctrlKey) && !event.shiftKey) ||
        (!isEditingContent(event) && event.key === "/" && !isOpen)
      ) {
        event.preventDefault();

        if (isOpen) {
          onClose();
        } else if (!document.body.classList.contains("DocSearch--active")) {
          open();
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onOpen, onClose]);
}

// @ts-ignore
function isEditingContent(event) {
  let element = event.target;
  let tagName = element.tagName;
  return element.isContentEditable || tagName === "INPUT" || tagName === "SELECT" || tagName === "TEXTAREA";
}
