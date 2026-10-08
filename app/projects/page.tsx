import { Metadata } from "next";

import { projects } from "@/components/Projects/projectsData";
import ProjectsGrid from "@/components/Projects/ProjectsGrid";
import { Mark } from "@/components/Resume/Mark";
import { JsonLd } from "@/components/seo/JsonLd";
import PageHeader from "@/components/ui/PageHeader";
import { ogImage, ogImageUrl } from "@/lib/og";
import { absoluteUrl, siteConfig } from "@/lib/site";

const og = {
  title: "Projects",
  description: `Featured projects by ${siteConfig.name}, including the Distributed File Storage System.`,
  path: "projects",
  tags: ["file storage", "software development"],
} as const;

export const metadata: Metadata = {
  title: `Projects | ${siteConfig.name}`,
  description: og.description,
  alternates: { canonical: "/projects" },
  openGraph: {
    title: `Projects | ${siteConfig.name}`,
    description: og.description,
    url: absoluteUrl("/projects"),
    type: "website",
    images: [ogImage(og)],
  },
  twitter: {
    card: "summary_large_image",
    title: `Projects | ${siteConfig.name}`,
    description: og.description,
    images: [ogImageUrl(og)],
  },
};

const ProjectsPage = () => {
  return (
    <section className="mx-auto flex max-w-200 flex-col px-8 md:px-0">
      <JsonLd
        type="webpage"
        title="Projects"
        description={og.description}
        canonicalUrl={absoluteUrl("/projects")}
      />
      <JsonLd
        type="breadcrumb"
        items={[
          { name: "Home", url: siteConfig.baseUrl },
          { name: "Projects", url: absoluteUrl("/projects") },
        ]}
      />
      <PageHeader title="Projects">
        Featured work: <Mark>Distributed File Storage System</Mark>.
      </PageHeader>

      <ProjectsGrid projects={projects} initialCount={projects.length} />

      <div className="pb-14" />
    </section>
  );
};

export default ProjectsPage;
