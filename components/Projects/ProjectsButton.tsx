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
    <div className="flex items-center gap-2">
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
          className="text-content-muted hover:text-content-secondary transition-colors"
        >
          <Globe size={18} />
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
          className="text-content-muted hover:text-content-secondary transition-colors"
        >
          <Github size={18} />
        </Link>
      )}
    </div>
  );
};

export default ProjectsButton;
