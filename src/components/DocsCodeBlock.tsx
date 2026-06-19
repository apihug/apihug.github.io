import clsx from "clsx";
import { CodeCopyButton } from "@/components/CodeCopyButton";

type Props = {
  code: string;
  className?: string;
  compact?: boolean;
};

const LANGUAGE_LABELS: Record<string, string> = {
  shell: "Terminal",
  bash: "Terminal",
  sh: "Terminal",
  zsh: "Terminal",
  powershell: "PowerShell",
  ps1: "PowerShell",
  javascript: "JavaScript",
  js: "JavaScript",
  typescript: "TypeScript",
  ts: "TypeScript",
  json: "JSON",
  java: "Java",
  kotlin: "Kotlin",
  yaml: "YAML",
  yml: "YAML",
  html: "HTML",
  css: "CSS",
  xml: "XML",
  sql: "SQL",
};

function getCodeBlockLabel(className?: string) {
  const language = className?.replace(/^language-/, "").toLowerCase();
  if (!language) {
    return "Code";
  }

  return LANGUAGE_LABELS[language] ?? `${language.charAt(0).toUpperCase()}${language.slice(1)}`;
}

function CodeInner({ code, className, padded }: { code: string; className?: string; padded?: boolean }) {
  return (
    <pre
      className={clsx(
        "m-0 flex overflow-x-auto bg-slate-900/95 text-[13px] leading-6 text-slate-50 ligatures-none",
        padded && "px-4 py-4",
      )}
    >
      <code className={clsx("min-w-full flex-none whitespace-pre", className)}>{code}</code>
    </pre>
  );
}

export function DocsCodeBlock({ code, className, compact = false }: Props) {
  if (compact) {
    return <CodeInner code={code} className={className} />;
  }

  const label = getCodeBlockLabel(className);

  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950 shadow-sm shadow-slate-950/20">
      <div className="flex items-center justify-between border-b border-white/10 bg-slate-900 px-4 py-2">
        <span className="text-[0.6875rem] font-medium tracking-wide text-slate-400">{label}</span>
        <CodeCopyButton value={code} />
      </div>
      <CodeInner code={code} className={className} padded />
    </div>
  );
}
