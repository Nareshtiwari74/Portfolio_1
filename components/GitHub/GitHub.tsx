import GitHubActivity, {
  type Contribution,
  type RepoContribution,
} from "@/components/ui/github-activity";
import { Stagger } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site";

const CONTRIBUTIONS_QUERY = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        weeks {
          contributionDays {
            date
            contributionCount
            contributionLevel
          }
        }
      }
      commitContributionsByRepository(maxRepositories: 100) {
        repository {
          owner {
            __typename
            login
            url
            avatarUrl(size: 64)
          }
        }
        contributions {
          totalCount
        }
      }
    }
  }
}`;

type GitHubContributionLevel =
  | "NONE"
  | "FIRST_QUARTILE"
  | "SECOND_QUARTILE"
  | "THIRD_QUARTILE"
  | "FOURTH_QUARTILE";

const contributionLevelMap: Record<
  GitHubContributionLevel,
  Contribution["level"]
> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

type GitHubActivityData = {
  contributions: Contribution[];
  repos: RepoContribution[];
};

async function fetchGitHubActivity(): Promise<GitHubActivityData> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return { contributions: [], repos: [] };

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables: { login: siteConfig.handle },
      }),
    });
    if (!res.ok) return { contributions: [], repos: [] };

    const body = await res.json();
    const collection = body?.data?.user?.contributionsCollection;
    const weeks: {
      contributionDays: {
        date: string;
        contributionCount: number;
        contributionLevel: GitHubContributionLevel;
      }[];
    }[] = collection?.contributionCalendar?.weeks ?? [];
    const repos: {
      repository: {
        owner: {
          __typename: "Organization" | "User";
          login: string;
          url: string;
          avatarUrl: string;
        };
      };
      contributions: { totalCount: number };
    }[] = collection?.commitContributionsByRepository ?? [];
    const organizations = new Map<string, RepoContribution>();

    for (const { repository, contributions } of repos) {
      const owner = repository.owner;
      if (owner.__typename !== "Organization" || owner.login === "code50")
        continue;

      const existing = organizations.get(owner.login);
      organizations.set(owner.login, {
        name: owner.login,
        href: owner.url,
        avatarUrl: owner.avatarUrl,
        count: (existing?.count ?? 0) + contributions.totalCount,
      });
    }

    return {
      contributions: weeks.flatMap((week) =>
        week.contributionDays.map((day) => ({
          date: day.date,
          count: day.contributionCount,
          level: contributionLevelMap[day.contributionLevel] ?? 0,
        }))
      ),
      repos: [...organizations.values()]
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
        .map((organization) => organization),
    };
  } catch (error) {
    console.error("Failed to fetch GitHub activity:", error);
    return { contributions: [], repos: [] };
  }
}

const GitHub = async () => {
  const { contributions, repos } = await fetchGitHubActivity();

  return (
    <section className="mx-auto mt-15 w-full max-w-200 px-8 md:px-0">
      <Stagger>
        <div className="mb-6">
          <p className="text-content-muted mb-1 text-sm font-medium tracking-wider uppercase">
            Open Source
          </p>
          <h2 className="text-3xl font-bold tracking-tight">GitHub Activity</h2>
        </div>

        <GitHubActivity
          username={siteConfig.handle}
          contributions={contributions}
          repos={repos}
          accent="#22c55e"
          showMonths
          label="Top organizations:"
          className="w-full rounded-[36px] border-6 border-neutral-50 shadow-sm sm:min-w-200 dark:border-neutral-900"
        />
      </Stagger>
    </section>
  );
};

export default GitHub;
