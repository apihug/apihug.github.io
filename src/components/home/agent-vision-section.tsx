import GridContainer from "../grid-container";
import LinkButton from "./link-button";
import CategoryHeader from "./category-header";

const CAPABILITIES = [
  {
    title: "MCP Server Generation",
    description: "Generate MCP servers from API contracts so agents can discover and invoke services without custom glue.",
  },
  {
    title: "Tool Schema & Catalog",
    description: "Turn endpoints into typed tools with clear inputs, outputs, and pagination.",
  },
  {
    title: "Agent Permission Model",
    description: "Apply RBAC and audit trails so agent actions stay within enterprise boundaries.",
  },
  {
    title: "Semantic API Contracts",
    description: "Use structured protobuf contracts that reduce ambiguity for both humans and LLMs.",
  },
  {
    title: "SDK & Language Bindings",
    description: "Generate client bindings from one contract for Java, TypeScript, Python, and Go.",
  },
  {
    title: "Enterprise Governance",
    description: "Carry observability, tracing, and compliance through generated artifacts.",
  },
];

export default function AgentVisionSection() {
  return (
    <div className="relative max-w-full">
      <GridContainer className="2xl:before:hidden 2xl:after:hidden">
        <CategoryHeader className="text-violet-500 dark:text-violet-400">Agent Native</CategoryHeader>
      </GridContainer>

      <GridContainer>
        <h2 className="max-w-lg px-2 text-[2.5rem]/10 font-medium tracking-tighter text-balance max-sm:px-4 2xl:mt-0">
          Make your APIs ready for AI agents.
        </h2>
      </GridContainer>

      <GridContainer className="mt-4">
        <p className="max-w-(--breakpoint-md) px-2 text-base/7 text-gray-600 max-sm:px-4 dark:text-gray-400">
          Agents are now API consumers. ApiHug gives them typed tools, governed access, and the same contract model your engineers already use.
        </p>
      </GridContainer>

      <GridContainer className="mt-16">
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 px-2 max-sm:px-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((cap) => (
            <div key={cap.title} className="flex flex-col gap-3">
              <h3 className="text-base/7 font-semibold text-gray-950 dark:text-white">{cap.title}</h3>
              <p className="text-sm/6 text-gray-600 dark:text-gray-400">{cap.description}</p>
            </div>
          ))}
        </div>
      </GridContainer>

      <GridContainer className="mt-16">
        <div className="relative overflow-hidden rounded-2xl bg-gray-950 p-8 dark:bg-gray-900">
          <div className="relative z-10 flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold text-white">
                Enterprise Intent Compiler
              </h3>
              <p className="max-w-(--breakpoint-sm) text-sm/6 text-gray-400">
                From business intent to deployed systems. ApiHug gives humans and AI agents one unambiguous contract across the delivery lifecycle.
              </p>
            </div>
            <LinkButton
              href="/docs/mcp/001_start"
              className="inline-block shrink-0 rounded-4xl bg-sky-500 px-5 py-2.5 text-sm/6 font-semibold text-white hover:bg-sky-400 dark:bg-sky-400 dark:text-gray-950 dark:hover:bg-sky-300"
            >
              Explore MCP
            </LinkButton>
          </div>
          <div className="absolute inset-0 bg-[image:repeating-linear-gradient(315deg,_rgba(255,255,255,0.03)_0,_rgba(255,255,255,0.03)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px]" aria-hidden="true" />
        </div>
      </GridContainer>
    </div>
  );
}
