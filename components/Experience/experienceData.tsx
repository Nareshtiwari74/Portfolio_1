import { type ReactNode } from "react";

export type Role = {
  id: string;
  /** Logo shown in the leading circle. */
  logo: ReactNode;
  org: string;
  role: string;
  period: string;
  location: string;
  highlights: string[];
  /**
   * Renders the live merged-PR count and the most recent pull requests into
   * repos I do not own.
   */
  livePrs?: boolean;
  /** Optional "read more" target shown at the foot of the expanded panel. */
  link?: { href: string; label: string };
};

/** Confirmed internships and locations, most recent first. */
export const roles: Role[] = [
  {
    id: "zynkly-intern",
    logo: "Z",
    org: "Zynkly",
    role: "AI/ML Engineer Intern",
    period: "Apr 2026 – Jul 2026",
    location: "Jalandhar",
    highlights: [
      "Built a Python-based KYC prototype using OCR and face matching for worker identity verification, exposed through Swagger-documented REST APIs.",
      "Presented the prototype to founders, explaining its technical workflow and worker-onboarding use case.",
      "Automated support workflows using LLM APIs.",
    ],
  },
  {
    id: "mphasis-intern",
    logo: "M",
    org: "Mphasis",
    role: "Software Development Intern",
    period: "Jan 2026 – Apr 2026",
    location: "Pune",
    highlights: [
      "Developed 9 REST endpoints for a Bookstore backend using Java, Spring Boot, and Hibernate; documented API contracts with Swagger.",
      "Designed a normalized MySQL schema with one-to-many and many-to-many relationships; validated data using SQL joins and subqueries.",
      "Implemented input validation, global exception handling, and structured JSON error responses.",
      "Collaborated in a 5-member Agile team across 3 sprints through sprint planning, Git pull requests, and code reviews.",
    ],
  },
];
