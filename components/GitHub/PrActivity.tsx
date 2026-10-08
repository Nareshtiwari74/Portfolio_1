"use client";

import { useEffect, useState } from "react";

import {
  AlertTriangle,
  FolderGit2,
  GitMerge,
  GitPullRequest,
  GitPullRequestClosed,
} from "lucide-react";

import { formatDate } from "@/lib/formatDate";
import {
  fetchPrActivity,
  getCachedPrActivity,
  type PrResult,
  type PrType,
  type PullRequest,
} from "@/lib/githubPrs";
import { siteConfig } from "@/lib/site";

import { projects } from "../Projects/projectsData";

const PAGE_SIZE = 5;

const TABS: { key: PrType; label: string }[] = [
  { key: "merged", label: "Merged" },
  { key: "opened", label: "Open" },
  { key: "closed", label: "Closed" },
];

type TabState = PrResult | { status: "loading" };

/**
 * Seeds every tab from the cache during render, so a remount within the cache
 * window paints immediately instead of flashing skeletons.
 */
const initialTabs = (): Record<PrType, TabState> =>
  Object.fromEntries(
    TABS.map(({ key }) => {
      const cached = getCachedPrActivity(key);
      return [
        key,
        cached
          ? ({ status: "success", data: cached } as const)
          : ({ status: "loading" } as const),
      ];
    }),
  ) as Record<PrType, TabState>;

/** The date that matters for a tab: when it merged, closed, or was opened. */
const primaryDate = (pr: PullRequest, type: PrType) => {
  if (type === "merged") return pr.mergedAt ?? pr.closedAt ?? pr.createdAt;
  if (type === "closed") return pr.closedAt ?? pr.createdAt;
  return pr.createdAt;
};

const prVisual = (pr: PullRequest) => {
  if (pr.isMerged) return { Icon: GitMerge, color: "text-merged" };
  if (pr.state === "closed")
    return { Icon: GitPullRequestClosed, color: "text-danger-content" };
  return { Icon: GitPullRequest, color: "text-success-content" };
};

const RowSkeleton = () => (
  <div className="border-line flex items-center justify-between gap-4 border-b px-2 py-4 last:border-b-0">
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <div className="bg-surface-strong size-4 shrink-0 animate-pulse rounded" />
      <div className="bg-surface-strong h-4 w-2/3 animate-pulse rounded" />
    </div>
    <div className="bg-surface-strong h-4 w-20 shrink-0 animate-pulse rounded" />
  </div>
);

const PrActivity = () => {
  const [activeTab, setActiveTab] = useState<PrType>("merged");
  const [tabs, setTabs] = useState<Record<PrType, TabState>>(initialTabs);
  const [expanded, setExpanded] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const results = await Promise.all(
        TABS.map((tab) => fetchPrActivity(tab.key)),
      );
      if (cancelled) return;
      setTabs(
        Object.fromEntries(
          TABS.map((tab, i) => [tab.key, results[i]]),
        ) as Record<PrType, TabState>,
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const current = tabs[activeTab];
  const pullRequests =
    current.status === "success" ? current.data.pullRequests : [];
  const visible = expanded ? pullRequests : pullRequests.slice(0, PAGE_SIZE);
  const remaining = pullRequests.length - visible.length;
  const showProjectFallback =
    current.status !== "loading" &&
    (current.status !== "success" || pullRequests.length === 0);

  return (
    <>
      {/* Concentric corners: the frame's radius is the card's 18px plus its
          own 6px border. */}
      <div className="bg-surface-subtle mx-8 mt-8 max-w-200 overflow-hidden rounded-[24px] border-6 border-neutral-50 shadow-sm md:mx-auto dark:border-neutral-900">
        <div className="bg-surface-subtle max-w-200 rounded-2xl border p-6 shadow-sm md:p-10">
          {/* Tabs + Profile Link */}
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="border-line bg-surface-raised inline-flex items-center gap-1 rounded-[15px] border p-1">
              {TABS.map((tab) => {
                const state = tabs[tab.key];
                const isActive = tab.key === activeTab;
                return (
                  <button
                    key={tab.key}
                    aria-pressed={isActive}
                    onClick={() => {
                      setActiveTab(tab.key);
                      setExpanded(false);
                    }}
                    className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-surface-float text-content shadow-sm"
                        : "text-content-muted hover:text-content"
                    }`}
                  >
                    {tab.label}
                    {state.status === "success" && (
                      <span className="text-content-subtle text-xs">
                        {state.data.totalCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* GitHub Profile Link */}
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-chunky border-line-strong text-content-secondary flex shrink-0 items-center gap-2 rounded-full border py-2 ps-3.5 pe-4 text-sm font-medium"
            >
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              View Profile
            </a>
          </div>

          {/* Body */}
          {current.status === "loading" && (
            <div>
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <RowSkeleton key={i} />
              ))}
            </div>
          )}

          {(current.status === "error" ||
            current.status === "rate-limited") && (
            <div className="border-line-strong text-content-muted flex items-center gap-2 rounded-xl border border-dashed p-6 text-sm">
              <AlertTriangle size={16} className="shrink-0" />
              <div>
                <p>{current.message}</p>
                <button
                  onClick={() => {
                    setTabs(initialTabs());
                    setReloadKey((key) => key + 1);
                  }}
                  className="text-content-muted hover:text-content mt-4 text-sm transition-[color,scale] duration-150 ease-out active:scale-[0.96]"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {current.status === "success" && pullRequests.length === 0 && (
            <p className="text-content-muted p-6 text-center text-sm">
              No{" "}
              {activeTab === "opened"
                ? "open"
                : activeTab === "closed"
                  ? "closed, unmerged"
                  : "merged"}{" "}
              pull requests right now.
            </p>
          )}

          {showProjectFallback && (
            <div className="mt-4">
              <p className="text-content-subtle mb-2 text-sm">
                Featured project
              </p>
              {projects.slice(0, 1).map((project) => (
                <a
                  key={project.id}
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-line hover:bg-surface-raised flex items-center justify-between gap-4 rounded-lg border-b px-2 py-4 transition-colors last:border-b-0"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <FolderGit2
                      size={16}
                      className="text-content-muted shrink-0"
                    />
                    <span className="text-content truncate font-medium">
                      {project.name}
                    </span>
                  </div>
                  <span className="text-content-muted shrink-0 text-sm">
                    View code
                  </span>
                </a>
              ))}
            </div>
          )}

          {current.status === "success" && pullRequests.length > 0 && (
            <div>
              {visible.map((pr) => {
                const { Icon, color } = prVisual(pr);
                return (
                  <a
                    key={pr.id}
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-line hover:bg-surface-raised flex items-center justify-between gap-4 rounded-lg border-b px-2 py-4 transition-colors last:border-b-0"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <Icon size={16} className={`shrink-0 ${color}`} />
                      <span className="text-content truncate font-medium">
                        {pr.title}
                      </span>
                      <span className="text-content-subtle hidden shrink-0 text-sm sm:inline">
                        {pr.repository}
                      </span>
                    </div>
                    <span className="text-content-muted shrink-0 font-mono text-sm">
                      {formatDate(primaryDate(pr, activeTab))}
                    </span>
                  </a>
                );
              })}

              {remaining > 0 && (
                <button
                  onClick={() => setExpanded(true)}
                  className="text-content-muted hover:text-content mt-4 text-sm transition-[color,scale] duration-150 ease-out active:scale-[0.96]"
                >
                  Show all ({remaining} more)
                </button>
              )}
              {expanded && pullRequests.length > PAGE_SIZE && (
                <button
                  onClick={() => setExpanded(false)}
                  className="text-content-muted hover:text-content mt-4 text-sm transition-[color,scale] duration-150 ease-out active:scale-[0.96]"
                >
                  Show less
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="h-10" />
    </>
  );
};

export default PrActivity;
