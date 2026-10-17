import { introductionText } from "./personal-content";

/**
 * Single source of truth for who the site belongs to and where it lives.
 * Every page's metadata, the JSON-LD blocks, the sitemap, and robots.txt all
 * read from here rather than re-deriving the base URL from `process.env`.
 */
export const siteConfig = {
  name: "Naresh Tiwari",
  handle: "Nareshtiwari74",
  role: "Software Developer",
  description: introductionText,
  baseUrl: "https://www.nareshdev.space",
  email: "nareshtiwarilog@gmail.com",
  github: "https://github.com/Nareshtiwari74",
  leetcode: "https://leetcode.com/u/tnaresh/",
  x: "https://x.com/NareshTiwai",
  instagram: "https://www.instagram.com/naresh_tiwarioff/",
  profileImage: "/naresh-avatar.jpg",
  easterEggImage: "/Logo_easter.webp",
  resumePath: "/Naresh_Tiwari_Resume.pdf" as string | null,
  sameAs: [
    "https://github.com/Nareshtiwari74",
    "https://leetcode.com/u/tnaresh/",
    "https://x.com/NareshTiwai",
    "https://www.instagram.com/naresh_tiwarioff/",
  ],
} as const;

/** Personal integrations are opt-in; no original author's account defaults. */
export const integrationConfig = {
  backendUrl:
    process.env.NEXT_PUBLIC_PORTFOLIO_API_URL?.replace(/\/$/, "") || "",
  calLink:
    process.env.NEXT_PUBLIC_CAL_LINK?.trim() || "naresh-tiwari-vfj1ak/30min",
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL?.trim() || "",
  discordUserId: process.env.NEXT_PUBLIC_DISCORD_USER_ID || "",
  activityEnabled: process.env.PORTFOLIO_ACTIVITY_ENABLED === "true",
} as const;

/** A dedicated portfolio backend; unrelated to the featured project's API. */
export const API_BASE_URL = integrationConfig.backendUrl;

/** Absolute URL for a site-relative path, e.g. `absoluteUrl("/blogs")`. */
export const absoluteUrl = (path: string) => `${siteConfig.baseUrl}${path}`;
