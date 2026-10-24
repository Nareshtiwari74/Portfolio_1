"use client";

import { useState } from "react";

import { ArrowUpRight } from "lucide-react";
import { AnimatePresence } from "motion/react";

import ProjectModal from "@/components/Projects/ProjectModal";
import { projects } from "@/components/Projects/projectsData";

const MacFolderIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className="shrink-0"
    aria-hidden="true"
    focusable="false"
  >
    <path fill="#8BD5FF" d="M2 5a2 2 0 0 1 2-2h5l2 2h9a2 2 0 0 1 2 2v12H2Z" />
    <path fill="#38A9F5" d="M2 8h20v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z" />
    <path fill="#64C5FF" d="M2 8h20v2H2Z" />
  </svg>
);

/** Confirmed featured project under the hero. */
const PersonalInfo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const project = projects.find(
    (item) => item.id === "distributed-file-storage",
  );
  if (!project) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        className="group border-line hover:border-line-strong hover:bg-surface-raised relative my-5 flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 pt-11 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        <span className="backend-ribbon absolute top-0 left-0 overflow-hidden rounded-tl-xl rounded-br-xl bg-[#ABEC4D] px-4 py-1.5 text-[10px] font-bold tracking-widest text-neutral-950 uppercase">
          Backend
        </span>
        <span className="flex min-w-0 items-center gap-3">
          <span
            className="bg-success size-2 shrink-0 rounded-full"
            aria-hidden="true"
          />
          <span className="flex min-w-0 flex-col gap-1">
            <span className="text-content-muted text-xs font-medium tracking-wider uppercase">
              Featured Project
            </span>
            <span className="text-content flex items-start gap-2 text-sm font-semibold">
              <MacFolderIcon size={16} />
              {project.name}
            </span>
            <span className="text-content-muted text-xs">
              Explore the architecture & key features
            </span>
          </span>
        </span>
        <ArrowUpRight
          size={18}
          className="text-content-secondary shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <ProjectModal project={project} onClose={() => setIsOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default PersonalInfo;
