import { Metadata } from "next";

import ProjectsGrid from "@/components/Projects/ProjectsGrid";
import { Mark } from "@/components/Resume/Mark";
import { JsonLd } from "@/components/seo/JsonLd";
import { shenanigans } from "@/components/Shenanigans/ShenanigansHelper";
import PageHeader from "@/components/ui/PageHeader";
import { ogImage, ogImageUrl } from "@/lib/og";
import { absoluteUrl, siteConfig } from "@/lib/site";

const og = {
  title: "Shenanigans",
  description: shenanigans.length
    ? `Side projects and experiments by ${siteConfig.name}.`
    : `Side projects and experiments by ${siteConfig.name}. No entries are published yet.`,
  path: "Shenanigans",
  tags: ["experiments", "for-fun"],
} as const;

export const metadata: Metadata = {
  title: `Shenanigans | ${siteConfig.name}`,
  description: og.description,
  robots: { index: shenanigans.length > 0, follow: true },
  alternates: { canonical: "/Shenanigans" },
  openGraph: {
    title: `Shenanigans | ${siteConfig.name}`,
    description: og.description,
    url: absoluteUrl("/Shenanigans"),
    type: "website",
    images: [ogImage(og)],
  },
  twitter: {
    card: "summary_large_image",
    title: `Shenanigans | ${siteConfig.name}`,
    description: og.description,
    images: [ogImageUrl(og)],
  },
};

const page = () => {
  return (
    <div className="mx-auto max-w-200 px-8 md:px-0">
      <JsonLd
        type="webpage"
        title="Shenanigans"
        description={og.description}
        canonicalUrl={absoluteUrl("/Shenanigans")}
      />
      <JsonLd
        type="breadcrumb"
        items={[
          { name: "Home", url: siteConfig.baseUrl },
          { name: "Shenanigans", url: absoluteUrl("/Shenanigans") },
        ]}
      />
      <PageHeader title="Shenanigans">
        A space for <Mark>side projects and experiments</Mark>.
      </PageHeader>

      <ProjectsGrid projects={shenanigans} initialCount={shenanigans.length} />
      {shenanigans.length === 0 && (
        <p className="text-content-secondary">
          No side projects published yet.
        </p>
      )}
    </div>
  );
};

export default page;
