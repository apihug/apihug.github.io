import { getZhCNSectionAndTitleBySlug } from "../../../zhCN-docs/api";

export default async function ZhCNBreadcrumbPage(props: { params: Promise<{ slug: string[] }> }) {
  let params = await props.params;
  let slugStr = params.slug.join("/");
  let sectionAndTitle = getZhCNSectionAndTitleBySlug(slugStr);

  return (
    <p className="truncate font-mono text-xs/6 font-medium text-gray-500 dark:text-gray-400">
      {sectionAndTitle?.section ?? "Documentation"}
      {sectionAndTitle ? (
        <>
          <span className="mx-2 text-gray-400 dark:text-gray-600">/</span>
          {sectionAndTitle.title}
        </>
      ) : null}
    </p>
  );
}
