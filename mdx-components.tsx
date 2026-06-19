import type { MDXComponents } from "mdx/types";
import React from "react";
import { DocsCodeBlock } from "@/components/DocsCodeBlock";
import { DocsJetBrainsMarketplaceCard, DocsMavenCentralBadge } from "@/components/DocsStartResources";
import { TipGood, TipBad, TipInfo, TipCompat } from "@/components/Tip";

const JETBRAINS_MARKETPLACE_HREF = "https://plugins.jetbrains.com/plugin/23534-apihug--api-design-copilot";

function getTextContent(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getTextContent).join("");
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return getTextContent(node.props.children);
  }

  return "";
}

function isMavenCentralHref(href?: string) {
  return Boolean(href?.includes("https://search.maven.org/artifact/com.apihug/"));
}

function isJetBrainsMarketplaceHref(href?: string) {
  return href === JETBRAINS_MARKETPLACE_HREF;
}

function getMeaningfulChildren(children: React.ReactNode) {
  return React.Children.toArray(children).filter((child) => typeof child !== "string" || child.trim() !== "");
}

/**
 * Global MDX components available in all .mdx files without explicit imports.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    TipGood,
    TipBad,
    TipInfo,
    TipCompat,
    p(props) {
      const children = getMeaningfulChildren(props.children);

      if (children.length === 1) {
        const child = children[0];

        if (React.isValidElement<{ href?: string; children?: React.ReactNode }>(child)) {
          const label = getTextContent(child.props.children).trim();

          if (label === "Maven Central" && isMavenCentralHref(child.props.href)) {
            return <DocsMavenCentralBadge href={child.props.href} />;
          }

          if (label === "JetBrains Marketplace" && isJetBrainsMarketplaceHref(child.props.href)) {
            return <DocsJetBrainsMarketplaceCard />;
          }
        }
      }

      return <p {...props} />;
    },
    a(props) {
      const label = getTextContent(props.children).trim();

      if (label === "Maven Central" && isMavenCentralHref(props.href)) {
        return <DocsMavenCentralBadge href={props.href} inline />;
      }

      return <a {...props} />;
    },
    pre(props) {
      let child = React.Children.only(props.children);
      let codeChild = React.isValidElement<{ className?: string; children?: React.ReactNode }>(child) ? child : null;

      if (!codeChild || typeof codeChild.props.children !== "string") {
        return <pre {...props} />;
      }

      return <DocsCodeBlock className={codeChild.props.className} code={codeChild.props.children} />;
    },
    ...components,
  };
}
