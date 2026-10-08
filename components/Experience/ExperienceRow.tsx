"use client";

import { useState } from "react";

import Link from "next/link";

import {
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  GitMerge,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { formatDate } from "@/lib/formatDate";

import type { Role } from "./experienceData";
import { RECENT_PR_COUNT, useMergedPrs } from "./useMergedPrs";

/** easeOutQuint — the same curve the reveal animations use. */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const PrRowSkeleton = () => (
  <div className="border-line flex items-start gap-3 rounded-xl border px-3 py-2.5">
    <div className="bg-surface-strong mt-0.5 size-3.5 shrink-0 animate-pulse rounded" />
    <div className="min-w-0 flex-1 space-y-2">
      <div className="bg-surface-strong h-3 w-3/4 animate-pulse rounded" />
      <div className="bg-surface-strong h-2.5 w-1/3 animate-pulse rounded" />
    </div>
  </div>
);

const Bullet = ({ children }: { children: React.ReactNode }) => (
  <li className="text-content-secondary flex items-start gap-3 text-sm">
    <ChevronRight size={16} className="text-content-subtle mt-0.5 shrink-0" />
    <span className="leading-relaxed">{children}</span>
  </li>
);

type RowProps = {
  item: Role;
  isOpen: boolean;
  onToggle: () => void;
};

const ExperienceRow = ({ item, isOpen, onToggle }: RowProps) => {
  const reduceMotion = useReducedMotion();
  /** Latches on first open so the data survives collapsing the row again. */
  const [hasOpened, setHasOpened] = useState(false);
  const prs = useMergedPrs(Boolean(item.livePrs) && hasOpened);

  const handleToggle = () => {
    if (!isOpen) setHasOpened(true);
    onToggle();
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls={`experience-${item.id}`}
        className={`hover:bg-surface-strong/15 flex w-full cursor-pointer items-center gap-4 px-5 py-5 text-left transition-colors sm:px-6 ${
          isOpen ? "bg-surface-strong/10" : ""
        }`}
      >
        {/* Logo */}
        <span className="border-line text-content grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border p-[7px]">
          {item.logo}
        </span>

        {/* Org + role */}
        <span className="min-w-0 flex-1">
          <span className="text-content block text-[15px] leading-snug font-bold">
            {item.org}
          </span>
          <span className="text-content-muted mt-0.5 block text-sm leading-snug">
            {item.role}
          </span>

          {/* Meta on mobile: its own row under the title, so the title is free
              to use the full card width instead of sharing it with a column. */}
          <span className="mt-2 flex items-center justify-between gap-3 sm:hidden">
            <span className="text-content-subtle font-mono text-[9px] tracking-widest uppercase">
              {item.location}
            </span>
            <span className="text-content-secondary text-[11px] whitespace-nowrap">
              {item.period}
            </span>
          </span>
        </span>

        {/* Meta from sm up: a right-hand column beside the title. */}
        <span className="hidden shrink-0 flex-col items-end text-right sm:flex">
          <span className="text-content-secondary text-sm whitespace-nowrap">
            {item.period}
          </span>
          <span className="text-content-subtle mt-0.5 font-mono text-[10px] tracking-widest uppercase">
            {item.location}
          </span>
        </span>

        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2, ease: EASE }}
          className="text-content-muted shrink-0"
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>

      {/* Expanding panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`experience-${item.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: { duration: reduceMotion ? 0 : 0.3, ease: EASE },
                opacity: { duration: 0.25, ease: EASE },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: reduceMotion ? 0 : 0.2, ease: EASE },
                opacity: { duration: 0.15, ease: EASE },
              },
            }}
            className="bg-surface-strong/10 overflow-hidden"
          >
            <div className="px-5 pb-6 sm:px-6 sm:pl-20">
              <ul className="space-y-3">
                {item.livePrs && (
                  <Bullet>
                    {prs.status === "error" ? (
                      "Pull request activity is currently unavailable."
                    ) : (
                      <>
                        Merged{" "}
                        {prs.status === "loading" ? (
                          <span className="bg-surface-strong inline-block h-3 w-6 animate-pulse rounded align-middle" />
                        ) : (
                          <span className="text-content font-bold">
                            {prs.count}
                          </span>
                        )}{" "}
                        pull requests into open source repositories.
                      </>
                    )}
                  </Bullet>
                )}

                {item.highlights.map((highlight) => (
                  <Bullet key={highlight}>{highlight}</Bullet>
                ))}
              </ul>

              {item.livePrs && prs.status !== "error" && (
                <div className="mt-5">
                  <p className="text-content-subtle mb-2 font-mono text-[10px] font-bold tracking-widest uppercase">
                    Latest merged
                  </p>

                  {prs.status === "loading" ? (
                    <div className="space-y-2">
                      {Array.from({ length: RECENT_PR_COUNT }).map((_, i) => (
                        <PrRowSkeleton key={i} />
                      ))}
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {prs.recent.map((pr) => (
                        <li key={pr.id}>
                          <a
                            href={pr.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group border-line hover:border-line-strong hover:bg-surface-strong/15 flex items-start gap-3 rounded-xl border px-3 py-2.5 transition-colors"
                          >
                            <GitMerge
                              size={14}
                              className="text-merged mt-0.5 shrink-0"
                            />
                            <span className="min-w-0 flex-1">
                              <span className="text-content-secondary group-hover:text-content block text-[13px] leading-snug transition-colors">
                                {pr.title}
                              </span>
                              <span className="text-content-subtle mt-1 block font-mono text-[10px] tracking-wide">
                                {pr.repository} · {formatDate(pr.mergedAt)}
                              </span>
                            </span>
                            <ArrowUpRight
                              size={12}
                              className="text-content-subtle mt-1 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {item.link && (
                <Link
                  href={item.link.href}
                  className="group text-content-muted hover:text-content mt-5 inline-flex items-center gap-1 font-mono text-[10px] font-bold tracking-widest uppercase transition-colors"
                >
                  {item.link.label}
                  <ArrowUpRight
                    size={12}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExperienceRow;
