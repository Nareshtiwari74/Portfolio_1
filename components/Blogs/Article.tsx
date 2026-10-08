import { type ReactNode } from "react";

import Image from "next/image";
import Link from "next/link";

import {
  type BlogPost,
  formatPostDate,
  postImageUrl,
  posts,
} from "@/components/Blogs/postsData";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, siteConfig } from "@/lib/site";

/**
 * The shell every post shares, and the small vocabulary of blocks their bodies
 * are built from.
 *
 * Layout, rhythm and type roles come from the editorial layer in
 * `app/editorial.css`; colour comes from `app/theme.css`, so a post is the same
 * page as the rest of the site. The rules the shell holds itself to:
 *
 * - Prose stops at a reading measure. Evidence — figures, terminals, tables —
 *   is the only thing allowed to run the full column.
 * - No all-caps eyebrow over the title, and no capsule around ordinary
 *   metadata. The category and the date are metadata; they read as metadata.
 * - A boundary has to be earned. An aside gets a rule, not a box; a box inside
 *   a box is a hierarchy that failed.
 * - Stillness by default. Nothing here waits for a scroll before it will let
 *   the reader read it.
 */

const SOCIALS = [
  { href: siteConfig.x, label: "X" },
  { href: siteConfig.github, label: "GitHub" },
  { href: siteConfig.leetcode, label: "LeetCode" },
];

/** One end of the newer/older pair under a post. */
const Sibling = ({ post, role }: { post: BlogPost; role: string }) => (
  <Link
    href={`/blogs/${post.slug}`}
    className="border-line ed-stack group border-t pt-4"
    data-gap="tight"
  >
    <span className="ed-meta">{role}</span>
    <span className="ed-heading-20 group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
      {post.title}
    </span>
  </Link>
);

/**
 * The post shell. Everything in the masthead — title, lede, date, read time,
 * hero — is read from `postsData` by slug, so a post and the index can never
 * disagree about what a post is.
 */
export const Article = ({
  slug,
  heroCaption,
  children,
}: {
  /** Must match a `slug` in `postsData`. */
  slug: string;
  /** Says what the reader should notice in the hero, when that isn't obvious. */
  heroCaption?: string;
  children: ReactNode;
}) => {
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) {
    throw new Error(`No post in postsData for slug "${slug}".`);
  }

  const post = posts[index];
  const newer = posts[index - 1];
  const older = posts[index + 1];
  const canonicalUrl = absoluteUrl(`/blogs/${post.slug}`);

  return (
    <div className="editorial bg-surface min-h-screen">
      {/* Emitted from `postsData` rather than restated per post, so the
          structured data and the visible masthead can never disagree. */}
      <JsonLd
        type="article"
        title={post.title}
        description={post.description}
        canonicalUrl={canonicalUrl}
        publishedAt={post.publishedAt}
        modifiedAt={post.updatedAt ?? post.publishedAt}
        imageUrl={postImageUrl(post)}
        tags={post.tags}
        articleSection={post.category}
      />
      <JsonLd
        type="breadcrumb"
        items={[
          { name: "Home", url: siteConfig.baseUrl },
          { name: "Blogs", url: absoluteUrl("/blogs") },
          { name: post.title, url: canonicalUrl },
        ]}
      />
      <main id="main" className="mx-auto max-w-200 px-6 pt-12 pb-24 md:px-0">
        <nav aria-label="Breadcrumb" className="mb-10">
          <Link href="/blogs" className="ed-link-quiet ed-meta">
            All posts
          </Link>
        </nav>

        <header className="ed-stack mb-12">
          <h1 className="ed-title">{post.title}</h1>
          <p className="ed-lede">{post.description}</p>
          <p className="ed-meta">
            <time dateTime={post.publishedAt}>
              {formatPostDate(post.publishedAt)}
            </time>
            {post.updatedAt && post.updatedAt !== post.publishedAt && (
              <>
                <span aria-hidden="true"> · </span>
                Updated{" "}
                <time dateTime={post.updatedAt}>
                  {formatPostDate(post.updatedAt)}
                </time>
              </>
            )}
            <span aria-hidden="true"> · </span>
            {post.category}
            <span aria-hidden="true"> · </span>
            {post.readTime}
          </p>
        </header>

        <figure className="ed-figure mb-16">
          <Image
            src={post.image}
            alt={post.imageAlt}
            width={1600}
            height={900}
            preload
            sizes="(max-width: 800px) 100vw, 800px"
            className="outline-image-outline aspect-video w-full rounded-lg object-cover outline -outline-offset-1"
          />
          {heroCaption && (
            <figcaption className="ed-caption">{heroCaption}</figcaption>
          )}
        </figure>

        <article className="ed-stack" data-gap="section">
          {post.keyAnswer && (
            <Answer question="The short answer">
              <p>{post.keyAnswer}</p>
            </Answer>
          )}
          {children}
          {post.faqs && <Faq items={post.faqs} />}
          {post.sources && <Sources items={post.sources} />}
        </article>

        <footer className="mt-24">
          {(newer || older) && (
            <nav aria-label="More posts" className="ed-stack mb-16">
              {newer && <Sibling post={newer} role="Newer" />}
              {older && <Sibling post={older} role="Older" />}
            </nav>
          )}

          <div className="border-line flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-baseline sm:justify-between">
            <div className="ed-stack" data-gap="tight">
              <p className="ed-label">{siteConfig.name}</p>
              <p className="ed-meta">{siteConfig.role}</p>
            </div>
            <ul className="ed-cluster ed-meta">
              {SOCIALS.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ed-link-quiet"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </main>
    </div>
  );
};

/* --------------------------------------------------------------------------
   Body blocks. A post writes semantic HTML inside these; the styling lives in
   `app/editorial.css` so the posts stay readable as writing.
   -------------------------------------------------------------------------- */

/** One titled movement of a post. */
export const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="ed-stack">
    <h2 className="ed-heading-24">{title}</h2>
    {children}
  </section>
);

/**
 * The closing movement: a rule and a wider gap mark it as a distinct beat
 * rather than one more body section.
 */
export const ClosingSection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="border-line ed-stack border-t pt-16">
    <h2 className="ed-heading-24">{title}</h2>
    {children}
  </section>
);

/**
 * An aside that sits apart from the main argument. A rule down the side, not a
 * card: the post is already inside a page, and a second box would only repeat
 * the boundary it is standing in.
 */
export const Aside = ({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) => (
  <aside className="ed-aside ed-stack">
    {title && <h3 className="ed-heading-20">{title}</h3>}
    {children}
  </aside>
);

/** The default body block: paragraphs, lists and inline code at reading measure. */
export const Prose = ({ children }: { children: ReactNode }) => (
  <div className="ed-prose">{children}</div>
);

/**
 * An article diagram. These are third-party images whose hosts aren't all in
 * `next.config`, so this is the one place in the app that deliberately renders
 * a plain `<img>`.
 *
 * Pass the intrinsic `width`/`height` whenever they're known: with the
 * `width: 100%; height: auto` rule in `editorial.css`, the attributes give the
 * browser the aspect ratio up front and the image reserves its own space
 * instead of shoving the paragraph below it down on load.
 */
export const Figure = ({
  src,
  alt,
  caption,
  width,
  height,
}: {
  src: string;
  alt: string;
  /** What the reader should notice, and what the image does not establish. */
  caption?: string;
  /** Intrinsic pixel width of the source image. */
  width?: number;
  /** Intrinsic pixel height of the source image. */
  height?: number;
}) => (
  <figure className="ed-figure">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={src} alt={alt} loading="lazy" width={width} height={height} />
    {caption && <figcaption className="ed-caption">{caption}</figcaption>}
  </figure>
);

/**
 * The short answer to the question the post's title asks, stated before the
 * argument that earns it.
 *
 * Keep it to 40–60 words and make it self-contained: this is the passage a
 * reader skims for and the passage an answer engine lifts, and neither of them
 * has the surrounding section for context.
 */
export const Answer = ({
  question,
  children,
}: {
  /** The question this block answers, phrased the way a reader would ask it. */
  question?: string;
  children: ReactNode;
}) => (
  <div className="ed-answer ed-stack" data-gap="tight">
    <p className="ed-label">{question ?? "In short"}</p>
    <div className="ed-prose">{children}</div>
  </div>
);

/**
 * The questions readers actually arrive with, answered in one self-contained
 * passage each.
 *
 * Answers are plain strings rather than JSX on purpose: the same text is the
 * visible answer and the `FAQPage` structured data, so the two cannot drift.
 */
export const Faq = ({
  items,
  title = "Frequently asked questions",
}: {
  items: { question: string; answer: string }[];
  title?: string;
}) => (
  <section className="border-line ed-stack border-t pt-16">
    <h2 className="ed-heading-24">{title}</h2>
    <JsonLd type="faq" items={items} />
    <div className="ed-faq">
      {items.map((item) => (
        <div key={item.question} className="ed-stack" data-gap="tight">
          <h3 className="ed-heading-20">{item.question}</h3>
          <div className="ed-prose">
            <p>{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

/**
 * Where the claims in the post come from. Primary sources — RFCs, specs,
 * repositories — beat write-ups about them, both for the reader checking the
 * work and for the systems weighing whether the post is worth citing.
 */
export const Sources = ({
  items,
  title = "Sources",
}: {
  items: { label: string; href: string; note?: string }[];
  title?: string;
}) => (
  <section className="border-line ed-stack border-t pt-16" data-gap="tight">
    <h2 className="ed-heading-20">{title}</h2>
    <ul className="ed-sources">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="ed-link"
          >
            {item.label}
          </Link>
          {item.note && <span className="ed-meta"> — {item.note}</span>}
        </li>
      ))}
    </ul>
  </section>
);

/**
 * A shell session. Dark in both themes on purpose — a terminal reads as a
 * terminal because it is dark.
 */
export const Terminal = ({ children }: { children: ReactNode }) => (
  <div className="ed-terminal">{children}</div>
);

/** A line the reader would type. */
export const Prompt = ({ children }: { children: ReactNode }) => (
  <div className="ed-prompt">$ {children}</div>
);

/** A line the machine printed back. */
export const Output = ({ children }: { children: ReactNode }) => (
  <div className="ed-output">{children}</div>
);

/**
 * Term-and-definition pairs. Replaces a row of identical metric boxes: the
 * relationship here is name-to-meaning, so name-to-meaning is what it looks
 * like.
 */
export const Defs = ({
  items,
}: {
  items: { term: ReactNode; definition: ReactNode }[];
}) => (
  <dl className="ed-defs">
    {items.map((item, i) => (
      <div key={i}>
        <dt>{item.term}</dt>
        <dd>{item.definition}</dd>
      </div>
    ))}
  </dl>
);

/**
 * A short sequence of stages, in order. Rendered as one ruled line rather than
 * a centred box, because the stages are the content and the box was not.
 */
export const Flow = ({
  steps,
  caption,
}: {
  steps: string[];
  caption?: string;
}) => (
  <figure className="ed-figure">
    <ol className="ed-sequence">
      {steps.map((step) => (
        <li key={step}>{step}</li>
      ))}
    </ol>
    {caption && <figcaption className="ed-caption">{caption}</figcaption>}
  </figure>
);

/** An ordered walkthrough. The number is the label; it does not need a circle. */
export const Steps = ({ items }: { items: ReactNode[] }) => (
  <ol className="ed-steps">
    {items.map((item, i) => (
      <li key={i}>
        <div>{item}</div>
      </li>
    ))}
  </ol>
);

/** A table that can scroll sideways on a narrow screen without the page doing so. */
export const TableWrap = ({ children }: { children: ReactNode }) => (
  <div className="ed-table-wrap">{children}</div>
);
