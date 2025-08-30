import { hostedAt } from "@/data";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      // Allow all search engines ("user agents") to crawl the entire site.
      userAgent: "*",
      allow: "/",

      // If you had specific pages you wanted to hide from search results,
      // you would list them here. For example:
      // disallow: '/private/',
    },
    // Provide the full URL to your sitemap.
    sitemap: `${hostedAt}/sitemap.xml`,
  };
}
