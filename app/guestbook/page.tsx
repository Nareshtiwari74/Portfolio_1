import { Metadata } from "next";

import Comments from "@/components/Comments/Comments";
import { Mark } from "@/components/Resume/Mark";
import { JsonLd } from "@/components/seo/JsonLd";
import PageHeader from "@/components/ui/PageHeader";
import { ogImage, ogImageUrl } from "@/lib/og";
import { guestbookConfigured } from "@/lib/guestbook/server";
import { absoluteUrl, integrationConfig, siteConfig } from "@/lib/site";

const og = {
  title: "Guestbook",
  description:
    "Leave a message for me and other visitors — feedback, a question, or just a simple hello.",
  path: "guestbook",
  tags: ["say-hi"],
} as const;

export const metadata: Metadata = {
  title: `Guestbook | ${siteConfig.name}`,
  description: "Leave a message, feedback, or just say hi!",
  robots: {
    index: Boolean(integrationConfig.backendUrl) || guestbookConfigured(),
    follow: true,
  },
  alternates: { canonical: "/guestbook" },
  openGraph: {
    title: `Guestbook | ${siteConfig.name}`,
    description: "Leave a message, feedback, or just say hi!",
    url: absoluteUrl("/guestbook"),
    type: "website",
    images: [ogImage(og)],
  },
  twitter: {
    card: "summary_large_image",
    title: `Guestbook | ${siteConfig.name}`,
    description: "Leave a message, feedback, or just say hi!",
    images: [ogImageUrl(og)],
  },
};

export default function GuestbookPage() {
  return (
    <section className="mx-auto flex max-w-200 flex-col">
      <JsonLd
        type="webpage"
        title="Guestbook"
        description={og.description}
        canonicalUrl={absoluteUrl("/guestbook")}
      />
      <JsonLd
        type="breadcrumb"
        items={[
          { name: "Home", url: siteConfig.baseUrl },
          { name: "Guestbook", url: absoluteUrl("/guestbook") },
        ]}
      />
      <PageHeader title="Guestbook" className="px-8 md:px-0">
        Leave a message for me and other visitors.{" "}
        <Mark>Feedback,a question, or just a simple hello</Mark>.
      </PageHeader>

      <Comments showAll={true} hideHeader={true} />

      <div className="pb-14" />
    </section>
  );
}
