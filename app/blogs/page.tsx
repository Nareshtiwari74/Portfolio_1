import { Metadata } from "next";

import BlogList from "@/components/Blogs/BlogList";
import { posts } from "@/components/Blogs/postsData";
import { Mark } from "@/components/Resume/Mark";
import { JsonLd } from "@/components/seo/JsonLd";
import PageHeader from "@/components/ui/PageHeader";
import { ogImage, ogImageUrl } from "@/lib/og";
import { absoluteUrl, siteConfig } from "@/lib/site";

const og = {
  title: "Blog",
  description: posts.length
    ? `Writing by ${siteConfig.name}.`
    : `Writing by ${siteConfig.name}. No articles are published yet.`,
  path: "blogs",
  tags: ["writing"],
} as const;

export const metadata: Metadata = {
  title: `Blog | ${siteConfig.name}`,
  description: og.description,
  robots: { index: posts.length > 0, follow: true },
  alternates: { canonical: "/blogs" },
  openGraph: {
    title: `Blog | ${siteConfig.name}`,
    description: og.description,
    url: absoluteUrl("/blogs"),
    type: "website",
    images: [ogImage(og)],
  },
  twitter: {
    card: "summary_large_image",
    title: `Blog | ${siteConfig.name}`,
    description: og.description,
    images: [ogImageUrl(og)],
  },
};

const BlogsPage = () => (
  <section className="mx-auto flex max-w-200 flex-col px-8 md:px-0">
    <JsonLd
      type="blog"
      title={`Blog | ${siteConfig.name}`}
      description={og.description}
      canonicalUrl={absoluteUrl("/blogs")}
      posts={posts.map((post) => ({
        title: post.title,
        description: post.description,
        url: absoluteUrl(`/blogs/${post.slug}`),
        publishedAt: post.publishedAt,
      }))}
    />
    <JsonLd
      type="breadcrumb"
      items={[
        { name: "Home", url: siteConfig.baseUrl },
        { name: "Blogs", url: absoluteUrl("/blogs") },
      ]}
    />
    {/* Deliberately outside `.editorial`: the page title block is shared with
        Projects and Resume, so it keeps the site font and the brand mark. */}
    <PageHeader title="Blogs">
      A space for <Mark>articles and notes</Mark>.
    </PageHeader>

    <div className="editorial pt-4 pb-14">
      <BlogList posts={posts} />
    </div>
  </section>
);

export default BlogsPage;
