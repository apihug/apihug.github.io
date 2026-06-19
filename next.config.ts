import type { NextConfig } from "next";
import createMdx from "@next/mdx";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@tailwindcss/node"],
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],

  /**
   * Enable static exports for the App Router.
   * @see https://nextjs.org/docs/app/building-your-application/deploying/static-exports
   */
  output: "export",

  /**
   * Disable server-based image optimization. Next.js does not support
   * dynamic features with static exports.
   */
  images: {
    unoptimized: true,
  },

  turbopack: {
    rules: {
      "*.react.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

const withMDX = createMdx({
  options: {
    remarkPlugins: [["remark-gfm"]],
  },
});
export default withMDX(nextConfig);
