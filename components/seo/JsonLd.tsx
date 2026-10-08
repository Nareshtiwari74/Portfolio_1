import { techStack } from "@/lib/personal-content";
import { absoluteUrl, siteConfig } from "@/lib/site";

/**
 * Every JSON-LD block the site emits. One component so the entity details —
 * name, URL, author, logo — are written once and can never drift between the
 * home page's `Person`, a post's `BlogPosting`, and the breadcrumbs.
 *
 * AI answer engines read this to decide *what* a page is before deciding
 * whether to cite it, so a block that points at a missing image or a stale URL
 * is worse than no block at all.
 */
type SchemaProps =
  | { type: "person" }
  | { type: "website" }
  | {
      type: "webpage";
      title: string;
      description: string;
      canonicalUrl: string;
    }
  | {
      type: "article";
      title: string;
      description: string;
      canonicalUrl: string;
      publishedAt?: string;
      /** ISO date of the last substantive edit. Recency is a citation signal. */
      modifiedAt?: string;
      /** Absolute URL of the post's hero. Falls back to the site logo. */
      imageUrl?: string;
      tags?: string[];
      articleSection?: string;
    }
  | {
      type: "blog";
      title: string;
      description: string;
      canonicalUrl: string;
      posts: {
        title: string;
        description: string;
        url: string;
        publishedAt: string;
      }[];
    }
  | { type: "breadcrumb"; items: { name: string; url: string }[] }
  | { type: "faq"; items: { question: string; answer: string }[] };

/** The current profile asset, shared with the visible portfolio. */
const logoUrl = absoluteUrl(siteConfig.profileImage);
const schemaAuthor = {
  "@type": "Person" as const,
  name: siteConfig.name,
  url: siteConfig.baseUrl,
};
const publisher = { ...schemaAuthor, image: logoUrl };

function buildSchema(props: SchemaProps): object {
  const ctx = "https://schema.org";

  if (props.type === "person") {
    return {
      "@context": ctx,
      ...schemaAuthor,
      "@id": `${siteConfig.baseUrl}#person`,
      alternateName: siteConfig.handle,
      image: logoUrl,
      jobTitle: siteConfig.role,
      description: siteConfig.description,
      email: `mailto:${siteConfig.email}`,
      knowsAbout: techStack.map((tech) => tech.name),
      sameAs: [...siteConfig.sameAs],
    };
  }

  if (props.type === "website") {
    return {
      "@context": ctx,
      "@type": "WebSite",
      "@id": `${siteConfig.baseUrl}#website`,
      name: siteConfig.name,
      url: siteConfig.baseUrl,
      description: siteConfig.description,
      inLanguage: "en",
      author: schemaAuthor,
      publisher,
    };
  }

  if (props.type === "webpage") {
    return {
      "@context": ctx,
      "@type": "WebPage",
      name: props.title,
      description: props.description,
      url: props.canonicalUrl,
      inLanguage: "en",
      isPartOf: { "@type": "WebSite", "@id": `${siteConfig.baseUrl}#website` },
      author: schemaAuthor,
      about: { "@id": `${siteConfig.baseUrl}#person` },
    };
  }

  if (props.type === "article") {
    return {
      "@context": ctx,
      "@type": "BlogPosting",
      headline: props.title,
      description: props.description,
      url: props.canonicalUrl,
      image: props.imageUrl ?? logoUrl,
      inLanguage: "en",
      ...(props.publishedAt && { datePublished: props.publishedAt }),
      // Google treats a missing `dateModified` as "never revisited". Publishing
      // date doubles as the modified date until a post is actually edited.
      dateModified: props.modifiedAt ?? props.publishedAt,
      ...(props.tags?.length && { keywords: props.tags.join(", ") }),
      ...(props.articleSection && { articleSection: props.articleSection }),
      author: { ...schemaAuthor, image: logoUrl },
      publisher,
      mainEntityOfPage: { "@type": "WebPage", "@id": props.canonicalUrl },
    };
  }

  if (props.type === "blog") {
    return {
      "@context": ctx,
      "@type": "Blog",
      name: props.title,
      description: props.description,
      url: props.canonicalUrl,
      inLanguage: "en",
      author: schemaAuthor,
      publisher,
      isPartOf: { "@type": "WebSite", "@id": `${siteConfig.baseUrl}#website` },
      blogPost: props.posts.map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        url: post.url,
        datePublished: post.publishedAt,
        author: schemaAuthor,
      })),
    };
  }

  if (props.type === "faq") {
    return {
      "@context": ctx,
      "@type": "FAQPage",
      mainEntity: props.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    };
  }

  // breadcrumb
  return {
    "@context": ctx,
    "@type": "BreadcrumbList",
    itemListElement: props.items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function JsonLd(props: SchemaProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSchema(props)) }}
    />
  );
}
