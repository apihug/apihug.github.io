import GridContainer from "../grid-container";
import LinkButton from "./link-button";
import CategoryHeader from "./category-header";

const FLOW_STEPS = [
  {
    label: "Define",
    title: "Protobuf Contract",
    description: "Describe the API in Protocol Buffers: structured, typed, and machine-readable.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="size-6">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Generate",
    title: "Spring Boot Services",
    description: "Controllers, DTOs, and service stubs generated with minimal manual wiring.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="size-6">
        <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Persist",
    title: "Database Schema",
    description: "Tables, indexes, and migrations generated from entity metadata.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="size-6">
        <ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: "Connect",
    title: "MCP & Agent Tools",
    description: "MCP servers and typed tools so agents can call your APIs safely.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="size-6">
        <path d="M12 2a3 3 0 00-3 3v4a3 3 0 006 0V5a3 3 0 00-3-3zM19 10a3 3 0 00-3 3v4a3 3 0 006 0v-4a3 3 0 00-3-3zM5 10a3 3 0 00-3 3v4a3 3 0 006 0v-4a3 3 0 00-3-3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function EnterpriseFactorySection() {
  return (
    <div className="relative max-w-full">
      <GridContainer className="2xl:before:hidden 2xl:after:hidden">
        <CategoryHeader className="text-fuchsia-500 dark:text-fuchsia-400">Enterprise Factory</CategoryHeader>
      </GridContainer>

      <GridContainer>
        <h2 className="max-w-lg px-2 text-[2.5rem]/10 font-medium tracking-tighter text-balance max-sm:px-4 2xl:mt-0">
          One definition. Everything generated.
        </h2>
      </GridContainer>

      <GridContainer className="mt-4">
        <p className="max-w-(--breakpoint-md) px-2 text-base/7 text-gray-600 max-sm:px-4 dark:text-gray-400">
          One proto contract generates services, database artifacts, SDKs, tests, and AI tooling. The same definition serves engineers, clients, and agents.
        </p>
      </GridContainer>

      <GridContainer className="mt-16">
        <div className="grid grid-cols-1 gap-8 px-2 max-sm:px-4 sm:grid-cols-2 lg:grid-cols-4">
          {FLOW_STEPS.map((step, i) => (
            <div
              key={step.label}
              className="relative flex flex-col gap-4 rounded-2xl bg-gray-950/3 p-6 dark:bg-white/5"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-500 dark:text-sky-400">
                  {step.icon}
                </div>
                <span className="font-mono text-xs/6 font-semibold text-sky-500 dark:text-sky-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-950 dark:text-white">{step.title}</h3>
              <p className="text-sm/6 text-gray-600 dark:text-gray-400">{step.description}</p>
              {i < FLOW_STEPS.length - 1 && (
                <div className="absolute top-1/2 -right-4 hidden size-8 items-center justify-center text-gray-300 lg:flex dark:text-gray-600">
                  <svg viewBox="0 0 24 24" fill="none" className="size-5">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </GridContainer>

      <GridContainer className="mt-12">
        <div className="flex gap-4 px-2 max-sm:px-4">
          <LinkButton href="/docs/start">Get started</LinkButton>
          <LinkButton
            href="/docs/framework"
            className="inline-block rounded-4xl !bg-white px-4 py-2 text-sm/6 font-semibold !text-gray-950 inset-ring inset-ring-gray-950/8 hover:!bg-gray-50 dark:!bg-gray-950 dark:!text-white dark:inset-ring-white/15 dark:hover:!bg-gray-900"
          >
            Learn more
          </LinkButton>
        </div>
      </GridContainer>
    </div>
  );
}
