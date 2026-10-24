import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site";

import { projects } from "./projectsData";
import ProjectsGrid from "./ProjectsGrid";

const Projects = () => {
  return (
    <section
      id="projects"
      className="mx-auto mt-15 w-full max-w-200 px-8 md:px-0"
    >
      <Reveal className="flex items-center justify-between">
        <div>
          <p className="text-content-muted mb-1 text-sm">Featured</p>
          <h2 className="text-content text-3xl font-bold">Projects</h2>
        </div>
        <Link
          href={siteConfig.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group text-content-muted flex items-center gap-1 text-xs"
        >
          View All on GitHub
          <ArrowUpRight
            size={12}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </Reveal>

      <p className="text-content-muted mt-3 max-w-xl text-sm leading-relaxed">
        Selected backend work, with implementation details, architecture, and
        engineering tradeoffs.
      </p>
      <ProjectsGrid
        projects={projects.filter((project) => project.featured)}
        initialCount={3}
        viewAllHref="/projects"
      />

      <div className="h-10" />
    </section>
  );
};

export default Projects;
