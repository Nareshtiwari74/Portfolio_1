"use client";

import { useState } from "react";

import ProjectImage from "./ProjectImage";
import ProjectRibbon from "./ProjectRibbon";
import ProjectsButton from "./ProjectsButton";
import type { ProjectType } from "./projectsData";
import { getStatusTone } from "./projectStatus";
import TechBadge from "./TechBadge";

/** Tech chips shown on the card; the rest roll into a "+N" chip. */
const MAX_VISIBLE_TECH = 2;

const ProjectCard = ({
  project,
  onViewCaseStudy,
}: {
  project: ProjectType;
  onViewCaseStudy: () => void;
}) => {
  const [showAllTech, setShowAllTech] = useState(false);
  const {
    name,
    tagline,
    description,
    shortDescription,
    image,
    imageGradient,
    tech,
    status,
    link,
    githubLink,
    badge,
  } = project;

  const statusTone = getStatusTone(status);
  const visibleTech = showAllTech ? tech : tech.slice(0, MAX_VISIBLE_TECH);
  const hiddenTechCount = Math.max(0, tech.length - MAX_VISIBLE_TECH);
  const technologiesId = `project-${project.id}-technologies`;

  return (
    <div className="group bg-surface-subtle hover:border-line-strong hover:bg-surface-raised relative flex h-full flex-col rounded-[35px] border p-5 transition-[background-color,border-color] duration-150 ease-out">
      {/* Image — inset so it lines up with the content below it */}
      <ProjectImage
        src={image}
        alt={name}
        className="aspect-[16/10] rounded-xl"
        gradient={imageGradient}
        width={500}
        height={300}
        zoomOnHover
      >
        {badge && <ProjectRibbon label={badge} />}
      </ProjectImage>

      {/* Content */}
      <div className="flex flex-1 flex-col pt-5">
        {/* Title, tagline & status */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-content text-xl font-bold transition-colors">
              {name}
            </h3>
            <p className="text-content-muted mt-1 text-sm">{tagline}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <span className={`size-2 rounded-full ${statusTone.dot}`} />
            <span className={`text-sm font-medium ${statusTone.text}`}>
              {statusTone.label}
            </span>
          </div>
        </div>

        {/* Short description — full write-up lives in the modal */}
        <p className="text-content-secondary mt-4 line-clamp-3 text-sm leading-relaxed">
          {shortDescription ?? description}
        </p>

        {/* Tech Stack & Links */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
          <div
            id={technologiesId}
            className="flex flex-wrap items-center gap-2"
          >
            {visibleTech.map((t) => (
              <TechBadge key={t} tech={t} />
            ))}
            {hiddenTechCount > 0 && (
              <button
                type="button"
                aria-expanded={showAllTech}
                aria-controls={technologiesId}
                aria-label={
                  showAllTech
                    ? `Show fewer technologies for ${name}`
                    : `Show all technologies for ${name}`
                }
                onClick={(event) => {
                  event.stopPropagation();
                  setShowAllTech((shown) => !shown);
                }}
                className="text-content-muted hover:text-content cursor-pointer text-xs transition-colors"
              >
                {showAllTech ? "Show less" : `+${hiddenTechCount}`}
              </button>
            )}
          </div>
          <ProjectsButton githubLink={githubLink} link={link} />
        </div>
        <button
          type="button"
          aria-haspopup="dialog"
          aria-label={`Read case study for ${name}`}
          onClick={(event) => {
            event.stopPropagation();
            onViewCaseStudy();
          }}
          className="btn-chunky border-line-strong text-content mt-4 w-full cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          Read Case Study
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
