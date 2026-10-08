import { posts } from "@/components/Blogs/postsData";
import { projects } from "@/components/Projects/projectsData";
import { shenanigans } from "@/components/Shenanigans/ShenanigansHelper";
import { techStack } from "@/lib/personal-content";
import { absoluteUrl, integrationConfig, siteConfig } from "@/lib/site";

/**
 * `/llms.txt` — the site in one plain-text file, for assistants and agents that
 * would otherwise have to render and scrape it. Format follows llmstxt.org: an
 * H1, a blockquote summary, then linked sections.
 *
 * Generated rather than checked in, so adding a post or a project keeps it
 * current instead of leaving a stale copy behind.
 */
const line = (title: string, url: string, note: string) =>
  `- [${title}](${url}): ${note}`;

function buildLlmsTxt() {
  const blogLines = posts.map((post) =>
    line(post.title, absoluteUrl(`/blogs/${post.slug}`), post.description),
  );

  const projectLines = projects
    .slice(0, 12)
    .map((project) =>
      line(
        `${project.name} — ${project.tagline}`,
        project.link || project.githubLink || absoluteUrl("/projects"),
        project.shortDescription ?? project.description,
      ),
    );

  const pageLines = [
    line(
      "Home",
      siteConfig.baseUrl,
      "Introduction, confirmed skills and featured projects",
    ),
    line(
      "Projects",
      absoluteUrl("/projects"),
      "Published project details and links",
    ),
  ];
  if (posts.length > 0) {
    pageLines.push(line("Blog", absoluteUrl("/blogs"), "Published articles"));
  }
  if (siteConfig.resumePath) {
    pageLines.push(
      line("Resume", absoluteUrl("/resume"), "Resume and download"),
    );
  }
  if (shenanigans.length > 0) {
    pageLines.push(
      line(
        "Shenanigans",
        absoluteUrl("/Shenanigans"),
        "Published side projects and experiments",
      ),
    );
  }
  if (integrationConfig.backendUrl) {
    pageLines.push(
      line("Guestbook", absoluteUrl("/guestbook"), "Visitor messages"),
    );
  }

  const socialLines = [
    `- GitHub: ${siteConfig.github}`,
    `- LeetCode: ${siteConfig.leetcode}`,
    `- X: ${siteConfig.x}`,
    `- Instagram: ${siteConfig.instagram}`,
  ];

  return `# ${siteConfig.name}

> ${siteConfig.description} Portfolio: ${siteConfig.baseUrl}.

## About

- Name: ${siteConfig.name} (${siteConfig.handle})
- Role: ${siteConfig.role}
- Tech stack: ${techStack.map((tech) => tech.name).join(", ")}
- Contact: ${siteConfig.email}
${socialLines.join("\n")}

## Pages

${pageLines.join("\n")}
${blogLines.length > 0 ? `\n## Writing\n\n${blogLines.join("\n")}\n` : ""}

## Projects

${projectLines.join("\n")}
`;
}

export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
