"use client";

import { useMemo, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { type BlogPost, formatPostDate } from "@/components/Blogs/postsData";

/**
 * The blog index: one lead entry carrying the hero image, then a dated list of
 * everything else.
 *
 * It is deliberately not a grid of identical image cards. Five cards of equal
 * weight say nothing about which post to read first, and the repeated
 * silhouette is the tell of a template. A lead plus a list says what is new,
 * and the date lane gives every title the same starting edge.
 */

/** "Jun 25, 2026" — the compact form used in the index's date lane. */
const shortDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

const LeadMeta = ({ post }: { post: BlogPost }) => (
  <p className="ed-meta">
    <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
    <span aria-hidden="true"> · </span>
    {post.category}
    <span aria-hidden="true"> · </span>
    {post.readTime}
  </p>
);

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach((post) =>
      post.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1)),
    );
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [posts]);

  const filtered = useMemo(
    () =>
      selectedTag ? posts.filter((p) => p.tags.includes(selectedTag)) : posts,
    [posts, selectedTag],
  );

  const [lead, ...rest] = filtered;

  return (
    <div className="ed-stack" data-gap="section">
      {/* Topic filter. Text controls, not capsules: the active state is carried
          by weight and a rule, so it survives without colour. */}
      <nav aria-label="Filter posts by topic" className="ed-stack">
        <h2 className="ed-label">Topics</h2>
        <div className="ed-cluster">
          {[{ name: "All", count: posts.length }, ...tags].map(
            ({ name, count }) => {
              const value = name === "All" ? null : name;
              const active = selectedTag === value;
              return (
                <button
                  key={name}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedTag(value)}
                  className={`cursor-pointer pb-1 text-[0.875rem] transition-colors ${
                    active
                      ? "text-content border-content border-b"
                      : "text-content-secondary hover:text-content border-b border-transparent"
                  }`}
                >
                  {name} <span className="tabular-nums">{count}</span>
                </button>
              );
            },
          )}
        </div>
      </nav>

      <section aria-label="Posts" className="ed-stack" data-gap="group">
        <p className="ed-meta" aria-live="polite">
          {filtered.length} post{filtered.length === 1 ? "" : "s"}
          {selectedTag ? ` tagged ${selectedTag}` : ""}
        </p>

        {!lead ? (
          <p className="text-content-secondary">
            {posts.length === 0
              ? "No articles published yet."
              : "Nothing filed under that topic yet."}
          </p>
        ) : (
          <>
            {/* Lead entry. The only post that gets an image, because it is the
                only post whose image is doing work. */}
            <article>
              <Link href={`/blogs/${lead.slug}`} className="group ed-stack">
                <figure className="ed-figure">
                  <Image
                    src={lead.image}
                    alt={lead.imageAlt}
                    width={1600}
                    height={900}
                    preload
                    sizes="(max-width: 800px) 100vw, 800px"
                    className="outline-image-outline aspect-video w-full rounded-lg object-cover outline -outline-offset-1"
                  />
                </figure>
                <div className="ed-stack" data-gap="tight">
                  <LeadMeta post={lead} />
                  <h3 className="ed-heading-24 group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                    {lead.title}
                  </h3>
                  <p className="ed-lede">{lead.description}</p>
                </div>
              </Link>
            </article>

            {rest.length > 0 && (
              <ol className="ed-stack" data-gap="tight">
                {rest.map((post) => (
                  <li key={post.slug} className="border-line border-t">
                    <Link
                      href={`/blogs/${post.slug}`}
                      className="ed-grid group py-6"
                    >
                      {/* Date lane. Every title in the list starts on the same
                          edge because the date never grows past it. */}
                      <div className="ed-stack col-span-12 sm:col-span-3">
                        <p className="ed-meta">
                          <time dateTime={post.publishedAt}>
                            {shortDate(post.publishedAt)}
                          </time>
                        </p>
                      </div>

                      <div
                        className="ed-stack col-span-12 mt-2 sm:col-span-9 sm:mt-0"
                        data-gap="tight"
                      >
                        <h3 className="ed-heading-20 group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                          {post.title}
                        </h3>
                        <p className="text-content-secondary text-[0.875rem] leading-relaxed">
                          {post.description}
                        </p>
                        <p className="ed-meta">
                          {post.category}
                          <span aria-hidden="true"> · </span>
                          {post.readTime}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </>
        )}
      </section>
    </div>
  );
}
