"use client";

import { useEffect, useState } from "react";

import {
  byMergedAtDesc,
  fetchPrActivity,
  getCachedPrActivity,
  type PrActivity,
  type PullRequest,
} from "@/lib/githubPrs";
import { siteConfig } from "@/lib/site";

/** How many recent pull requests the expanded panel lists. */
export const RECENT_PR_COUNT = 3;

type Panel = { count: number; recent: PullRequest[] };

export type MergedPrState =
  { status: "loading" } | ({ status: "success" } & Panel) | { status: "error" };

const toPanel = (activity: PrActivity): Panel => {
  // This row describes contributions to other people's projects. The general
  // activity board includes Naresh's own repositories as well.
  const contributions = activity.pullRequests.filter(
    (pr) =>
      pr.repository.split("/")[0]?.toLowerCase() !==
      siteConfig.handle.toLowerCase(),
  );
  return {
    count: contributions.length,
    recent: contributions.sort(byMergedAtDesc).slice(0, RECENT_PR_COUNT),
  };
};

const seed = (): MergedPrState => {
  const cached = getCachedPrActivity("merged");
  return cached
    ? { status: "success", ...toPanel(cached) }
    : { status: "loading" };
};

/**
 * Loads merged pull requests once `enabled` flips true — i.e. the first time
 * the row is opened — so a visitor who never expands it pays no network cost.
 */
export const useMergedPrs = (enabled: boolean): MergedPrState => {
  const [state, setState] = useState<MergedPrState>(seed);

  useEffect(() => {
    if (!enabled || state.status === "success") return;

    let cancelled = false;

    fetchPrActivity("merged").then((result) => {
      if (cancelled) return;
      setState(
        result.status === "success"
          ? { status: "success", ...toPanel(result.data) }
          : { status: "error" },
      );
    });

    return () => {
      cancelled = true;
    };
    // `state.status` is read only to skip a redundant fetch; re-running on it
    // would loop once the fetch resolves.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return state;
};
