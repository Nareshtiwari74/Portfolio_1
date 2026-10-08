/**
 * The blog index. One entry per post under `app/blogs/<slug>`, newest first.
 *
 * This is the single source of truth for a post's title, date and topics — the
 * index page reads it, and each post's own page reads its `lede` and `readTime`
 * from the same record rather than restating them.
 */
import { absoluteUrl } from "@/lib/site";

export type BlogPost = {
  /** Route segment under `/blogs`. */
  slug: string;
  title: string;
  /** The lede: one short passage orienting the reader before they commit. */
  description: string;
  /** Sentence-case subject area, e.g. "Network architecture". */
  category: string;
  /** Hero image, shown on the post and on the lead entry of the index. */
  image: string;
  imageAlt: string;
  tags: string[];
  /** ISO `YYYY-MM-DD`. Used for sorting and for the `<time>` element. */
  publishedAt: string;
  /**
   * ISO `YYYY-MM-DD` of the last substantive revision. Only set it when the
   * post's content actually changed — it feeds `dateModified` in the article
   * schema, and a date that moves without the writing moving is a lie to every
   * crawler that weighs freshness.
   */
  updatedAt?: string;
  readTime: string;
  /**
   * The post's own question, answered in one self-contained passage of 40–60
   * words. Rendered above the body — it is the passage a reader skims for, and
   * the passage an answer engine lifts without the rest of the page around it.
   */
  keyAnswer?: string;
  /** Questions readers arrive with. Rendered after the body as `FAQPage`. */
  faqs?: { question: string; answer: string }[];
  /** Primary sources the post's claims can be checked against. */
  sources?: { label: string; href: string; note?: string }[];
};

// Publish only writing supplied and approved by Naresh Tiwari.
export const posts: BlogPost[] = [
  {
    slug: "behind-the-pay-button",
    title:
      "Behind the Pay Button: Why Payment Routing and Orchestration Are Interesting",
    description:
      "How payment orchestration coordinates providers, routing decisions and eligible retries—and why payment correctness makes the engineering interesting.",
    category: "Payment systems",
    image: "/blog-img/payment-routing/cover.svg",
    imageAlt:
      "Behind the Pay Button: Pay, choose a route, and a payment provider",
    tags: ["Payments", "Backend", "Distributed systems"],
    publishedAt: "2026-10-09",
    readTime: "4 min read",
  },
];

/**
 * Absolute URL of a post's hero, for metadata and structured data. Some posts
 * point at a remote host and some at a file in `public/`, and a crawler needs
 * an absolute URL either way.
 */
export const postImageUrl = (post: BlogPost) =>
  post.image.startsWith("http") ? post.image : absoluteUrl(post.image);

/** Look a post up by its route segment. */
export const postBySlug = (slug: string) =>
  posts.find((post) => post.slug === slug);

/** "June 25, 2026" — the one date format the blog uses. */
export const formatPostDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
