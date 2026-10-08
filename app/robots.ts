import { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

/**
 * The AI crawlers that read pages in order to *cite* them, named explicitly.
 *
 * A wildcard `Allow` already covers them, but naming each one means a future
 * `Disallow` added to the wildcard rule can't silently take the site out of
 * ChatGPT, Perplexity, Claude and AI Overviews as a side effect. Training-only
 * crawlers (CCBot and friends) are deliberately not listed — blocking those is
 * a separate decision from being citable.
 */
const AI_SEARCH_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "Google-Extended",
  "Bingbot",
  "Applebot-Extended",
  "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
      {
        userAgent: AI_SEARCH_BOTS,
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${siteConfig.baseUrl}/sitemap.xml`,
    host: siteConfig.baseUrl,
  };
}
