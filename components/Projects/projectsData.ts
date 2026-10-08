import type { ProjectGradient } from "./ProjectImage";

export type ProjectType = {
  id: string;
  name: string;
  tagline: string;
  /** Full write-up, shown in the project modal. */
  description: string;
  /**
   * Trimmed blurb for the card (keep it to ~3 lines). Falls back to
   * `description` when absent, clamped to 3 lines either way.
   */
  shortDescription?: string;
  image: string;
  /**
   * Backdrop gradient behind the screenshot. Colour values, not Tailwind
   * classes — Tailwind can't generate classes from runtime data.
   */
  imageGradient: ProjectGradient;
  tech: string[];
  status: string;
  link: string;
  /** Optional public API link, shown alongside the live application. */
  apiLink?: string;
  githubLink: string;
  /** Optional "why I built this" notes, shown as a list in the project modal. */
  why?: string[];
  /**
   * Short brag shown as a diagonal ribbon across the card's screenshot, e.g.
   * "55+ users". Keep it to a few words — the band is only so wide.
   */
  badge?: string;
};

/** Every card gradient starts from the same neutral corner; only via/to vary. */
export const GRADIENT_FROM = "#f5f5f5";

export const projects: ProjectType[] = [
  {
    id: "distributed-file-storage",
    name: "Distributed File Storage System",
    tagline: "Secure File Storage",
    description:
      "Upload, manage, and securely access files, with deduplication to reduce storage usage.",
    shortDescription:
      "Upload, manage, and securely access files, with deduplication to reduce storage usage.",
    image: "/project-img/distributed-file-storage.png",
    imageGradient: { from: GRADIENT_FROM, via: "#ABEC4D", to: "#A3E925" },
    tech: ["Java", "Spring Boot", "React", "PostgreSQL", "Docker"],
    status: "Live",
    link: "https://storage.nareshdev.space",
    apiLink: "https://api1.nareshdev.space",
    githubLink: "https://github.com/Nareshtiwari74/distributed-file-storage",
  },
];
