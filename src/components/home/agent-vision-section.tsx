import GridContainer from "../grid-container";
import LinkButton from "./link-button";
import CategoryHeader from "./category-header";

const CAPABILITIES = [
  {
    title: "MCP Server Generation",
    description: "Auto-generate MCP servers from your API contracts. AI agents discover and invoke services without custom integration.",
  },
  {
    title: "Tool Schema & Catalog",
    description: "Every endpoint becomes a typed tool definition with input, output, and pagination — exactly what LLMs need.",
  },
  {
    title: "Agent Permission Model",
    description: "RBAC and audit trails keep AI agents operating within safe enterprise boundaries.",
  },
  {
    title: "Semantic API Contracts",
    description: "Protobuf eliminates ambiguity. LLMs reason best against structured, typed definitions with clear semantics.",
  },
  {
    title: "SDK & Language Bindings",
    description: "Client SDKs for any language from one contract — Java, TypeScript, Python, Go.",
  },
  {
    title: "Enterprise Governance",
    description: "Observability, tracing, and compliance built into every generated artifact.",
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
          Embrace the age of AI agents.
        </h2>
      </GridContainer>

      <GridContainer className="mt-4">
        <p className="max-w-(--breakpoint-md) px-2 text-base/7 text-gray-600 max-sm:px-4 dark:text-gray-400">
          In the AI era, your API consumers are agents — not just developers. ApiHug hugs both: giving humans clean contracts and LLMs the structured semantics they need to understand — not guess at — your enterprise.
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
                From business intent to deployed systems. ApiHug hugs both humans and AI agents into a shared, unambiguous contract — the foundation for the entire enterprise lifecycle.
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
