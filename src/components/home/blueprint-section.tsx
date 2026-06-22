import GridContainer from "../grid-container";
import CategoryHeader from "./category-header";

export default function BlueprintSection() {
  return (
    <div className="relative max-w-full">
      <GridContainer className="2xl:before:hidden 2xl:after:hidden">
        <CategoryHeader className="text-indigo-500 dark:text-indigo-400">
          The Blueprint
        </CategoryHeader>
      </GridContainer>

      <GridContainer>
        <h2 className="max-w-lg px-2 text-[2.5rem]/10 font-medium tracking-tighter text-balance max-sm:px-4 2xl:mt-0">
          The operating language between AI and enterprise systems.
        </h2>
      </GridContainer>

      <GridContainer className="mt-4">
        <p className="max-w-(--breakpoint-md) px-2 text-base/7 text-gray-600 max-sm:px-4 dark:text-gray-400">
          Single contract. Shared runtime. Security, governance, observability, and collaboration across the stack.
        </p>
      </GridContainer>

      <GridContainer className="mt-16">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/arch.svg"
            alt="ApiHug Architecture Blueprint - Semantic Execution Infrastructure for AI-Native Enterprises"
            className="w-full"
          />
        </div>
      </GridContainer>
    </div>
  );
}
