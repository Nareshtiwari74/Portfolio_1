"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import Link from "next/link";

import { ArrowUpRight, X } from "lucide-react";
import { motion } from "motion/react";

import ProjectImage from "./ProjectImage";
import ProjectRibbon from "./ProjectRibbon";
import ProjectCaseStudy from "./ProjectCaseStudy";
import ProjectsButton from "./ProjectsButton";
import type { ProjectType } from "./projectsData";
import { getStatusTone } from "./projectStatus";
import TechBadge from "./TechBadge";

/** Strong ease-out: the dialog lands fast and settles gently. */
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-content-muted mb-3 text-xs font-semibold tracking-wider uppercase">
    {children}
  </p>
);

/**
 * Detail view for a single project. Rendered only while a project is selected —
 * the caller mounting it *is* the open state, so there is no separate `isOpen`
 * flag to keep in step.
 */
const ProjectModal = ({
  project,
  onClose,
}: {
  project: ProjectType;
  onClose: () => void;
}) => {
  const statusTone = getStatusTone(project.status);
  const dialogRef = useRef<HTMLDivElement>(null);

  // A dialog with `aria-modal` has to answer Escape, and the page behind a
  // full-screen overlay should not scroll while it is up.
  useEffect(() => {
    const previousFocus = document.activeElement;
    dialogRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const controls = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex="0"]',
        ),
      );
      const first = controls[0];
      const last = controls.at(-1);
      if (!first || !last) {
        e.preventDefault();
        dialog.focus();
      } else if (
        e.shiftKey &&
        (document.activeElement === first || document.activeElement === dialog)
      ) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const previousOverflow = document.body.style.overflow;

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus();
      }
    };
  }, [onClose]);

  return createPortal(
    <>
      {/* Stacked above the sticky nav (z-100) so the dim covers the whole
          page, not everything but the header. */}
      <motion.div
        className="bg-surface/60 fixed inset-0 z-[110] h-full backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.15, ease: "easeOut" } }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />

      {/* Modals scale from the centre rather than from their trigger, and exit
          faster than they enter. */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{
          opacity: 0,
          scale: 0.96,
          transition: { duration: 0.15, ease: "easeOut" },
        }}
        transition={{ duration: 0.2, ease: EASE_OUT }}
        className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
        onClick={onClose}
      >
        <div
          ref={dialogRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          className="border-line bg-surface-subtle relative z-10 flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-y-auto rounded-2xl border shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <ProjectImage
            src={project.image}
            alt={project.name}
            className="shrink-0"
            gradient={project.imageGradient}
            fit="contain"
            width={800}
            height={500}
            overlay
          >
            {project.badge && <ProjectRibbon label={project.badge} />}
            <button
              type="button"
              onClick={onClose}
              className="bg-overlay/40 hover:bg-overlay/60 border-on-media/20 text-on-media absolute top-3 right-3 flex size-9 cursor-pointer items-center justify-center rounded-full border backdrop-blur-sm transition-[background-color,scale] duration-150 ease-out active:scale-[0.96]"
              aria-label="Close project details"
            >
              <X className="size-4" />
            </button>

            <div className="absolute right-6 bottom-4 left-6">
              <p className="text-content-subtle mb-1 text-xs font-semibold tracking-wider uppercase">
                {project.tagline}
              </p>
              <h2
                id="project-modal-title"
                className="text-on-media text-2xl font-bold sm:text-3xl"
              >
                {project.name}
              </h2>
            </div>
          </ProjectImage>

          <div className="flex flex-col p-5 sm:p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${statusTone.pill}`}
              >
                <span className={`size-2 rounded-full ${statusTone.dot}`} />
                {project.status}
              </div>
              <ProjectsButton
                githubLink={project.githubLink}
                link={project.link}
              />
            </div>

            <p className="text-content-secondary mb-6 text-sm leading-relaxed">
              {project.description}
            </p>

            {project.why && project.why.length > 0 && (
              <>
                <SectionLabel>Why I built it</SectionLabel>
                <ul className="mb-6 flex flex-col gap-2">
                  {project.why.map((reason) => (
                    <li
                      key={reason}
                      className="text-content-secondary flex gap-2.5 text-sm leading-relaxed"
                    >
                      <span
                        aria-hidden
                        className="bg-surface-strong mt-[7px] size-1.5 shrink-0 rounded-full"
                      />
                      {reason}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {project.caseStudy && (
              <ProjectCaseStudy details={project.caseStudy} />
            )}

            <SectionLabel>Technologies</SectionLabel>
            <div className="mb-6 flex flex-wrap gap-2">
              {project.tech.length === 0 && (
                <p className="text-content-muted text-sm">
                  Project details coming soon.
                </p>
              )}
              {project.tech.map((t) => (
                <TechBadge key={t} tech={t} />
              ))}
            </div>

            <div className="border-line mt-auto flex flex-wrap items-center gap-3 border-t pt-4">
              {project.link && (
                <Link
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-chunky border-line-strong text-content-secondary inline-flex items-center gap-2 rounded-full border py-2.5 ps-5 pe-4.5 text-sm font-medium"
                >
                  View Live
                  <ArrowUpRight size={16} />
                </Link>
              )}
              {project.apiLink && (
                <Link
                  href={project.apiLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-chunky border-line-strong text-content-secondary inline-flex items-center gap-2 rounded-full border py-2.5 ps-5 pe-4.5 text-sm font-medium"
                >
                  View API
                  <ArrowUpRight size={16} />
                </Link>
              )}
              {project.githubLink && (
                <Link
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-content-muted hover:text-content text-sm font-medium transition-colors"
                >
                  Source on GitHub
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>,
    document.body,
  );
};

export default ProjectModal;
