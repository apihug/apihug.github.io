"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";

type Props = {
  value: string;
  className?: string;
};

export function CodeCopyButton({ value, className }: Props) {
  let [{ copied, tick }, setCopyState] = useState({ copied: false, tick: 0 });

  useEffect(() => {
    if (!copied) {
      return;
    }

    let timer = window.setTimeout(() => {
      setCopyState((state) => ({ ...state, copied: false }));
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [copied, tick]);

  return (
    <button
      type="button"
      aria-label={copied ? "Copied code" : "Copy code"}
      title={copied ? "Copied" : "Copy"}
      className={clsx(
        "inline-flex size-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30",
        copied && "text-emerald-400",
        className,
      )}
      onClick={() => {
        setCopyState(({ tick }) => ({ copied: true, tick: tick + 1 }));
        navigator.clipboard.writeText(value).catch(() => {});
      }}
    >
      {copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
          <rect x="5.25" y="2.75" width="7.5" height="10" rx="1.25" />
          <path d="M10.25 13.25H4.5a1.25 1.25 0 0 1-1.25-1.25V5.75" />
        </svg>
      )}
    </button>
  );
}
