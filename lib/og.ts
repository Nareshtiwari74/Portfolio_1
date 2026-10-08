import { absoluteUrl, siteConfig } from "./site";

/**
 * Builds the URL for the dynamic Open Graph image rendered by `app/og/route.tsx`.
 *
 * Every page passes its own copy instead of pointing at a single static PNG, so
 * a shared link previews the page it actually links to. Omitted fields fall back
 * to the site-level defaults inside the route.
 */
export type OgParams = {
  /** Headline on the card. Defaults to `siteConfig.role`. */
  title?: string;
  /** Supporting line under the headline. Defaults to `siteConfig.description`. */
  description?: string;
  /** Breadcrumb after the domain, e.g. `blogs/dns`. Defaults to `home`. */
  path?: string;
  /** Up to 4 pills in the bottom-right corner. */
  tags?: readonly string[];
};

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

/** Absolute URL for the generated card — crawlers that ignore `metadataBase` need it. */
export function ogImageUrl({ title, description, path, tags }: OgParams = {}) {
  const params = new URLSearchParams();
  if (title) params.set("title", title);
  if (description) params.set("description", description);
  if (path) params.set("path", path);
  if (tags?.length) params.set("tags", tags.join(","));

  const query = params.toString();
  return absoluteUrl(query ? `/og?${query}` : "/og");
}

/** Same card, shaped for the `openGraph.images` array. */
export function ogImage(params: OgParams = {}) {
  return {
    url: ogImageUrl(params),
    ...OG_IMAGE_SIZE,
    alt: params.title
      ? `${params.title} — ${siteConfig.name}`
      : `${siteConfig.name} — ${siteConfig.role}`,
  };
}
