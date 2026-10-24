"use client";

import { useState } from "react";

import Link from "next/link";

import { ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import posthog from "posthog-js";

import {
  ITEM_STAGGER,
  revealHidden,
  revealShown,
  revealViewport,
} from "@/components/ui/Reveal";

import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import type { ProjectType } from "./projectsData";

const overflowButtonClass =
  "btn-chunky border-line-strong text-content-secondary group flex cursor-pointer items-center gap-2 rounded-full border py-2.5 ps-6 pe-5.5 text-sm font-medium";

interface ProjectsGridProps {
  projects: ProjectType[];
  initialCount?: number;
  /**
   * When set, the overflow control becomes a "View All" link to this route
   * instead of an inline Show More/Less toggle.
   */
  viewAllHref?: string;
}

const ProjectsGrid = ({
  projects,
  initialCount = 4,
  viewAllHref,
}: ProjectsGridProps) => {
  const reduceMotion = useReducedMotion();
  const [showAll, setShowAll] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(
    null,
  );

  const visibleProjects = showAll ? projects : projects.slice(0, initialCount);
  const hasMore = projects.length > initialCount;
  const openProject = (project: ProjectType) => {
    posthog.capture("project_modal_opened", {
      project_name: project.name,
      project_status: project.status,
    });
    setSelectedProject(project);
  };

  return (
    <>
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            key={selectedProject.id}
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {visibleProjects.map((project, index) => (
          <motion.div
            key={project.id}
            className="h-full cursor-pointer"
            onClick={() => openProject(project)}
            initial={revealHidden}
            whileInView={revealShown(
              reduceMotion,
              // Stagger within a batch: the "Show more" cards restart from 0 so
              // they don't inherit a long delay from their absolute index.
              ((index < initialCount ? index : index - initialCount) % 4) *
                ITEM_STAGGER,
            )}
            viewport={revealViewport}
          >
            <ProjectCard
              project={project}
              onViewCaseStudy={() => openProject(project)}
            />
          </motion.div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          {viewAllHref ? (
            <Link href={viewAllHref} className={overflowButtonClass}>
              View All
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          ) : (
            <button
              onClick={() => setShowAll(!showAll)}
              className={overflowButtonClass}
            >
              {showAll ? (
                <>
                  Show Less
                  <ChevronUp
                    size={16}
                    className="transition-transform group-hover:-translate-y-0.5"
                  />
                </>
              ) : (
                <>
                  Show More ({projects.length - initialCount} more)
                  <ChevronDown
                    size={16}
                    className="transition-transform group-hover:translate-y-0.5"
                  />
                </>
              )}
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default ProjectsGrid;
