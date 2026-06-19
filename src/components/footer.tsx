import clsx from "clsx";
import Link from "next/link";
import ThemeToggle from "./theme-toggle";

export function FooterSitemap({ className }: { className?: string }) {
  return (
    <footer className="bg-white text-sm/loose text-gray-950 dark:bg-gray-950 dark:text-white">
      <div className={clsx("flex gap-4 p-4 md:hidden", className)}>
        <div className="flex flex-1 flex-col gap-10">
          <div>
            <GettingStarted />
          </div>
          <div>
            <Framework />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-10">
          <div>
            <Resources />
          </div>
          <div>
            <Community />
          </div>
        </div>
      </div>
      <div
        className={clsx(
          "mx-auto hidden w-full grid-cols-4 justify-between gap-y-0 md:grid md:grid-cols-4 md:gap-6 md:gap-x-4 lg:gap-8",
          className,
        )}
      >
        <div className="border-x border-b border-gray-950/5 py-10 pl-2 not-md:border-0 md:border-b-0 dark:border-white/10">
          <GettingStarted />
        </div>
        <div className="border-x border-b border-gray-950/5 py-10 pl-2 not-md:border-0 md:border-b-0 dark:border-white/10">
          <Framework />
        </div>
        <div className="border-x border-b border-gray-950/5 py-10 pl-2 not-md:border-0 sm:border-b-0 dark:border-white/10">
          <Resources />
        </div>
        <div className="border-x border-gray-950/5 py-10 pl-2 not-md:border-0 dark:border-white/10">
          <Community />
        </div>
      </div>
    </footer>
  );
}

export function FooterMeta({ className }: { className?: string }) {
  return (
    <div className="px-2 pt-10 pb-24">
      <div
        className={clsx(
          "mx-auto flex w-full flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8",
          className,
        )}
      >
        <ThemeToggle />
        <div className="flex flex-col gap-4 text-sm/6 text-gray-700 sm:flex-row sm:gap-2 sm:pr-4 dark:text-gray-400">
          <span>Copyright &copy;&nbsp;{new Date().getFullYear()}&nbsp;ApiHug</span>
          <span className="max-sm:hidden">&middot;</span>
          <span>AI-native Enterprise Architecture Factory</span>
        </div>
      </div>
    </div>
  );
}

function GettingStarted() {
  return (
    <>
      <h3 className="font-semibold">Getting Started</h3>
      <ul className="mt-4 grid gap-4">
        <li>
          <Link href="/docs/start/what-is-apihug" className="hover:underline">
            What is ApiHug?
          </Link>
        </li>
        <li>
          <Link href="/docs/start" className="hover:underline">
            Quick Start
          </Link>
        </li>
        <li>
          <Link href="/docs/idea" className="hover:underline">
            Editor Plugin
          </Link>
        </li>
        <li>
          <Link href="/docs/protobuf" className="hover:underline">
            Protocol Buffers
          </Link>
        </li>
      </ul>
    </>
  );
}

function Framework() {
  return (
    <>
      <h3 className="font-semibold">Framework</h3>
      <ul className="mt-4 grid gap-4">
        <li>
          <Link href="/docs/framework" className="hover:underline">
            Overview
          </Link>
        </li>
        <li>
          <Link href="/docs/framework/spring-api" className="hover:underline">
            Spring API
          </Link>
        </li>
        <li>
          <Link href="/docs/framework/spring-data" className="hover:underline">
            Spring Data
          </Link>
        </li>
        <li>
          <Link href="/docs/mcp/001_start" className="hover:underline">
            MCP Server
          </Link>
        </li>
        <li>
          <Link href="/docs/copilot" className="hover:underline">
            Copilot
          </Link>
        </li>
      </ul>
    </>
  );
}

function Resources() {
  return (
    <>
      <h3 className="font-semibold">Resources</h3>
      <ul className="mt-4 grid gap-4">
        <li>
          <Link href="/docs/spec" className="hover:underline">
            Spec / Vibe
          </Link>
        </li>
        <li>
          <Link href="/docs/kola" className="hover:underline">
            Kola DSL
          </Link>
        </li>
        <li>
          <Link href="/docs/tool" className="hover:underline">
            Tool Chain
          </Link>
        </li>
        <li>
          <Link href="/docs/ui" className="hover:underline">
            UI Generation
          </Link>
        </li>
      </ul>
    </>
  );
}

function Community() {
  return (
    <>
      <h3 className="font-semibold">Community</h3>
      <ul className="mt-4 grid gap-4">
        <li>
          <Link href="https://github.com/apihug" className="hover:underline">
            GitHub
          </Link>
        </li>
        <li>
          <Link href="/blog" className="hover:underline">
            Blog
          </Link>
        </li>
        <li>
          <Link href="/docs/milestone" className="hover:underline">
            Milestones
          </Link>
        </li>
      </ul>
    </>
  );
}
