import axios from "axios";

import { createMemoryCache } from "@/lib/memoryCache";
import { siteConfig } from "@/lib/site";

const MAX_PAGES = 10; // GitHub Search API caps results at 1000 (100 per page)
const CACHE_TTL_MS = 5 * 60_000;

// GitHub search qualifiers per requested PR type.
// "closed" intentionally excludes merged PRs since "merged" is its own type.
const TYPE_QUERY_MAP = {
  opened: "is:pr is:open",
  merged: "is:pr is:merged",
  closed: "is:pr is:closed is:unmerged",
} as const;

export type PrType = keyof typeof TYPE_QUERY_MAP;

export const isPrType = (value: string | null): value is PrType =>
  value !== null && Object.hasOwn(TYPE_QUERY_MAP, value);

/** The subset of a GitHub Search API issue item that this service reads. */
type SearchItem = {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: string;
  html_url: string;
  repository_url?: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  labels?: { name: string }[];
  user?: { login: string; avatar_url: string; html_url: string };
  pull_request?: {
    merged_at: string | null;
    diff_url?: string;
    patch_url?: string;
  };
};

/**
 * Carries a safe public message and distinguishes rate limits from other
 * upstream failures without exposing GitHub's response details.
 */
export class GitHubApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "GitHubApiError";
    this.status = status;
  }
}

const mapPullRequest = (item: SearchItem) => {
  const repoName = item.repository_url?.split("/").slice(-2).join("/") ?? null;

  return {
    id: item.id,
    number: item.number,
    title: item.title,
    body: item.body,
    state: item.state,
    isMerged: Boolean(item.pull_request?.merged_at),
    url: item.html_url,
    diffUrl: item.pull_request?.diff_url ?? null,
    patchUrl: item.pull_request?.patch_url ?? null,
    repository: repoName,
    author: {
      login: item.user?.login,
      avatarUrl: item.user?.avatar_url,
      profileUrl: item.user?.html_url,
    },
    labels: (item.labels ?? []).map((label) => label.name),
    comments: item.comments,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    closedAt: item.closed_at,
    mergedAt: item.pull_request?.merged_at ?? null,
  };
};

type PrActivity = {
  type: PrType;
  totalCount: number;
  pullRequests: ReturnType<typeof mapPullRequest>[];
};

const caches: Record<
  PrType,
  ReturnType<typeof createMemoryCache<PrActivity>>
> = {
  merged: createMemoryCache<PrActivity>(CACHE_TTL_MS),
  opened: createMemoryCache<PrActivity>(CACHE_TTL_MS),
  closed: createMemoryCache<PrActivity>(CACHE_TTL_MS),
};

const pending: Record<PrType, Promise<PrActivity> | null> = {
  merged: null,
  opened: null,
  closed: null,
};

const loadPrActivity = async (type: PrType): Promise<PrActivity> => {
  const githubUsername = siteConfig.handle;
  const githubToken = process.env.GITHUB_TOKEN?.trim();

  try {
    // Public activity works without a token. Keep private repositories out of
    // the portfolio even when an optional token has access to them.
    const q = `${TYPE_QUERY_MAP[type]} is:public author:${githubUsername}`;
    const perPage = 100;
    let page = 1;
    let totalCount = 0;
    const pullRequests = [];

    while (page <= MAX_PAGES) {
      const { data } = await axios.get<{
        total_count: number;
        items: SearchItem[];
      }>("https://api.github.com/search/issues", {
        params: { q, per_page: perPage, page, sort: "updated", order: "desc" },
        headers: {
          ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {}),
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        timeout: 10_000,
      });

      totalCount = data.total_count;
      pullRequests.push(...data.items.map(mapPullRequest));

      if (data.items.length < perPage || pullRequests.length >= totalCount) {
        break;
      }
      page += 1;
    }

    return { type, totalCount, pullRequests };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      const isRateLimited =
        err.response.status === 429 ||
        (err.response.status === 403 &&
          (err.response.headers["x-ratelimit-remaining"] === "0" ||
            /rate limit/i.test(err.response.data?.message ?? "")));
      throw new GitHubApiError(
        isRateLimited
          ? "GitHub is temporarily rate limited. Please try again shortly."
          : "Unable to load pull requests right now.",
        isRateLimited ? 429 : 502,
      );
    }
    throw new GitHubApiError("Unable to load pull requests right now.", 502);
  }
};

/** Share fresh results and in-flight requests across visitors to spare GitHub's
 * public search allowance. Failed requests are never cached as zero activity. */
export const getPrActivity = async (type: PrType): Promise<PrActivity> => {
  const cached = caches[type].get();
  if (cached) return cached;
  if (pending[type]) return pending[type];

  const request = loadPrActivity(type);
  pending[type] = request;
  try {
    const data = await request;
    caches[type].set(data);
    return data;
  } finally {
    pending[type] = null;
  }
};
