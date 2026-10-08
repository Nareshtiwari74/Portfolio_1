import { MetadataRoute } from "next";

import { posts } from "@/components/Blogs/postsData";
import { shenanigans } from "@/components/Shenanigans/ShenanigansHelper";
import { absoluteUrl, integrationConfig, siteConfig } from "@/lib/site";

/**
 * Published routes, including one entry per approved post.
 *
 * Post dates come from `postsData` rather than `new Date()` — a sitemap that
 * claims every page changed today teaches crawlers to ignore its `lastmod`.
 */
const staticRoutes: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/projects", changeFrequency: "monthly", priority: 0.9 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const publishedRoutes = [...staticRoutes];
  if (posts.length > 0) {
    publishedRoutes.push({
      path: "/blogs",
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }
  if (siteConfig.resumePath) {
    publishedRoutes.push({
      path: "/resume",
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }
  if (shenanigans.length > 0) {
    publishedRoutes.push({
      path: "/Shenanigans",
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }
  if (integrationConfig.backendUrl) {
    publishedRoutes.push({
      path: "/guestbook",
      changeFrequency: "weekly",
      priority: 0.4,
    });
  }

  return [
    ...publishedRoutes.map(({ path, changeFrequency, priority }) => ({
      url: path === "/" ? siteConfig.baseUrl : absoluteUrl(path),
      changeFrequency,
      priority,
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/blogs/${post.slug}`),
      lastModified: new Date(`${post.updatedAt ?? post.publishedAt}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
