import type { ProjectGradient } from "./ProjectImage";

export type ProjectType = {
  id: string;
  featured?: boolean;
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
  caseStudy?: {
    decisions?: { title: string; detail: string }[];
    highlights: { title: string; detail: string }[];
    flow: { title: string; detail: string }[];
    deployment: string;
    roadmap: string;
    demoNote: string;
  };
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
    featured: true,
    name: "Distributed File Storage System",
    tagline: "Secure File Storage",
    badge: "Backend",
    description:
      "A full-stack file storage application built with Java 21 and Spring Boot. Files live in S3-compatible object storage, while PostgreSQL tracks their metadata and ownership.",
    shortDescription:
      "Upload, download, and manage private files. A Spring Boot API checks ownership on file operations, with PostgreSQL metadata and S3-compatible storage.",
    image: "/project-img/distributed-file-storage.png",
    imageGradient: { from: GRADIENT_FROM, via: "#ABEC4D", to: "#A3E925" },
    tech: ["Java", "Spring Boot", "React", "PostgreSQL", "Docker"],
    status: "Live",
    link: "https://storage.nareshdev.space",
    apiLink: "https://api1.nareshdev.space",
    githubLink: "https://github.com/Nareshtiwari74/distributed-file-storage",
    caseStudy: {
      decisions: [
        {
          title: "Separate file bytes from metadata",
          detail:
            "Object storage holds the files while PostgreSQL tracks ownership and metadata. This keeps binary data out of relational tables, but requires coordinating writes across two services.",
        },
        {
          title: "Keep storage behind an interface",
          detail:
            "StorageService supports MinIO locally and Supabase in production. This makes providers replaceable, while each adapter still needs testing against its provider's behavior.",
        },
        {
          title: "Start with a modular monolith",
          detail:
            "The current backend keeps authentication, validation, and file operations in one application. This simplifies deployment; replication and failover remain future work.",
        },
      ],
      highlights: [
        {
          title: "Private by design",
          detail:
            "JWT authentication, BCrypt password hashing, and ownership checks on every file operation.",
        },
        {
          title: "Integrity recorded",
          detail:
            "SHA-256 checksums computed on upload, with a 10 MB limit and clear errors for oversized files.",
        },
        {
          title: "Storage that can change",
          detail:
            "A StorageService interface connects to MinIO locally and Supabase in production without changing the file workflow.",
        },
        {
          title: "Built to be tested",
          detail:
            "JUnit 5 and Mockito for unit tests; Testcontainers for integration tests; Flyway for versioned database migrations.",
        },
      ],
      flow: [
        { title: "React", detail: "Choose a file" },
        { title: "Spring Boot", detail: "Authenticate & validate" },
        { title: "Object storage", detail: "Save file bytes" },
        { title: "PostgreSQL", detail: "Track owner & metadata" },
      ],
      deployment:
        "React on Vercel · Spring Boot on Render · PostgreSQL on Neon · Object storage on Supabase",
      roadmap:
        "Multi-node replication, failover, and self-healing are planned. The current backend is a modular monolith with a swappable storage layer.",
      demoNote:
        "Try it: register, upload a file up to 10 MB, then download or delete it. The backend runs on a free tier; the first request after inactivity may take 30–50 seconds.",
    },
  },
];
