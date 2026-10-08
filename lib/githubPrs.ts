import { createMemoryCache } from "@/lib/memoryCache";

/**
 * Canonical client for the pull-request feed. Both the PR activity
 * board and the Experience row read from here, so the cache,
 * and the response shape are defined once instead of once per surface.
 */

const ENDPOINT = "/api/github/pr-activity";
const CACHE_TTL_MS = 5 * 60_000;

export type PrType = "opened" | "merged" | "closed";

export interface PullRequest {
  id: number;
  number: number;
  title: string;
  state: string;
  isMerged: boolean;
  url: string;
  repository: string;
  createdAt: string;
  closedAt: string | null;
  mergedAt: string | null;
}

export interface PrActivity {
  type: PrType;
  totalCount: number;
  pullRequests: PullRequest[];
}

export type PrResult =
  | { status: "success"; data: PrActivity }
  | { status: "rate-limited"; message: string }
  | { status: "error"; message: string };

const caches: Record<
  PrType,
  ReturnType<typeof createMemoryCache<PrActivity>>
> = {
  merged: createMemoryCache<PrActivity>(CACHE_TTL_MS),
  opened: createMemoryCache<PrActivity>(CACHE_TTL_MS),
  closed: createMemoryCache<PrActivity>(CACHE_TTL_MS),
};

/**
 * Cached activity for a tab, or `null` when nothing fresh is in memory. Lets a
 * component seed its initial state during render instead of calling setState
 * from an effect on a cache hit.
 */
export const getCachedPrActivity = (type: PrType): PrActivity | null =>
  caches[type].get();

export async function fetchPrActivity(type: PrType): Promise<PrResult> {
  const cached = caches[type].get();
  if (cached) return { status: "success", data: cached };

  try {
    const res = await fetch(`${ENDPOINT}?type=${type}`);

    if (res.status === 429) {
      return {
        status: "rate-limited",
        message: "Rate limited — try again in a minute.",
      };
    }

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return {
        status: "error",
        message: body?.message || "Failed to load pull requests.",
      };
    }

    const data = (await res.json()) as PrActivity;
    caches[type].set(data);
    return { status: "success", data };
  } catch {
    return { status: "error", message: "Failed to load pull requests." };
  }
}

/** Most recently merged pull requests first. */
export const byMergedAtDesc = (a: PullRequest, b: PullRequest) =>
  (b.mergedAt ?? "").localeCompare(a.mergedAt ?? "");
