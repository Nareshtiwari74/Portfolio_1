"use client";

import Link from "next/link";

import { Github, Globe } from "lucide-react";
import posthog from "posthog-js";

const ProjectsButton = ({
  githubLink,
  link,
}: {
  githubLink: string;
  link: string;
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
      {link && (
        <Link
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.stopPropagation();
            posthog.capture("project_link_clicked", {
              link_type: "live",
              link_url: link,
            });
          }}
          className="text-content-muted hover:text-content-secondary inline-flex items-center gap-1.5 rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <Globe size={16} aria-hidden="true" /> Live Demo
        </Link>
      )}

      {githubLink && (
        <Link
          href={githubLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.stopPropagation();
            posthog.capture("project_link_clicked", {
              link_type: "github",
              link_url: githubLink,
            });
          }}
          className="text-content-muted hover:text-content-secondary inline-flex items-center gap-1.5 rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <Github size={16} aria-hidden="true" /> Source Code
        </Link>
      )}
    </div>
  );
};

export default ProjectsButton;
