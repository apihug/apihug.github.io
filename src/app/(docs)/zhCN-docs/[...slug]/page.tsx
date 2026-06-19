import Pagination from "@/components/pagination";
import TableOfContents from "@/components/table-of-contents";
import { notFound } from "next/navigation";
import { Metadata } from "next/types";
import { generateZhCNTableOfContents, getZhCNDocPageBySlug, getZhCNDocPageSlugs, getZhCNSectionAndTitleBySlug } from "../api";
import zhIndex from "../index";

type Props = {
  params: Promise<{
    slug: string[];
  }>;
};

export async function generateStaticParams() {
  let slugs = await getZhCNDocPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  let params = await props.params;
  let slugStr = params.slug.join("/");
  let sectionAndTitle = getZhCNSectionAndTitleBySlug(slugStr);
  let post = await getZhCNDocPageBySlug(slugStr);

  if (!post) {
    return {};
  }

  let title = `${post.title}${sectionAndTitle?.section ? ` - ${sectionAndTitle.section}` : ""}`;

  return {
    title,
    description: post.description,
    openGraph: {
      title,
      description: post.description,
      type: "article",
      url: `/zhCN-docs/${slugStr}`,
    },
  };
}

export default async function ZhCNDocPage(props: Props) {
  let params = await props.params;
  let slugStr = params.slug.join("/");

  let sectionAndTitle = getZhCNSectionAndTitleBySlug(slugStr);

  let [post, tableOfContents] = await Promise.all([
    getZhCNDocPageBySlug(slugStr),
    generateZhCNTableOfContents(slugStr),
  ]);

  if (!post) {
    return notFound();
  }

  return (
    <>
      {/* Placeholder div for Next.js router scrollable element */}
      <div hidden />

      <div className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-10 xl:max-w-5xl xl:grid-cols-[minmax(0,1fr)_var(--container-2xs)]">
        <div className="px-4 pt-10 pb-24 sm:px-6 xl:pr-0">
          {sectionAndTitle ? (
            <p
              className="flex items-center gap-2 font-mono text-xs/6 font-medium tracking-widest text-gray-600 uppercase dark:text-gray-400"
              data-section="true"
            >
              {sectionAndTitle.section}
            </p>
          ) : null}
          <h1 data-title="true" className="mt-2 text-3xl font-medium tracking-tight text-gray-950 dark:text-white">
            {post.title}
          </h1>
          <p data-description="true" className="mt-6 text-base/7 text-gray-700 dark:text-gray-400">
            {post.description}
          </p>

          <div className="prose mt-10" data-content="true">
            <post.Component />
          </div>
          <Pagination currentPath={`/zhCN-docs/${slugStr}`} navIndex={zhIndex} />
        </div>
        <div className="max-xl:hidden">
          <div className="sticky top-14 max-h-[calc(100svh-3.5rem)] overflow-x-hidden px-6 pt-10 pb-24">
            <TableOfContents tableOfContents={tableOfContents} />
          </div>
        </div>
      </div>
    </>
  );
}
