import type { Metadata } from "next";

import { Resume } from "@/components/Resume/Resume";
import { JsonLd } from "@/components/seo/JsonLd";
import { ogImage, ogImageUrl } from "@/lib/og";
import { siteConfig } from "@/lib/site";

const description = `${siteConfig.name}'s resume. ${siteConfig.role}.`;
const canonicalUrl = `${siteConfig.baseUrl}/resume`;

const og = {
  title: "Resume",
  description,
  path: "resume",
  tags: ["software developer"],
} as const;

export const metadata: Metadata = {
  title: `Resume | ${siteConfig.name}`,
  description,
  robots: { index: Boolean(siteConfig.resumePath), follow: true },
  openGraph: {
    type: "website",
    url: canonicalUrl,
    title: `Resume | ${siteConfig.name}`,
    description,
    images: [ogImage(og)],
  },
  twitter: {
    card: "summary_large_image",
    title: `Resume | ${siteConfig.name}`,
    description,
    images: [ogImageUrl(og)],
  },
  alternates: { canonical: canonicalUrl },
};

export default function ResumePage() {
  return (
    <>
      <JsonLd
        type="webpage"
        title="Resume"
        description={description}
        canonicalUrl={canonicalUrl}
      />
      <JsonLd
        type="breadcrumb"
        items={[
          { name: "Home", url: siteConfig.baseUrl },
          { name: "Resume", url: canonicalUrl },
        ]}
      />
      <Resume />
    </>
  );
}
