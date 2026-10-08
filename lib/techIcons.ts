/**
 * Icon sources for technology names. Two CDNs are in play:
 *
 * - skillicons.dev serves full-colour marks and needs no theme handling.
 * - cdn.simpleicons.org serves monochrome marks, requested in white and
 *   flipped to black in light mode so pale marks don't vanish.
 */

/** simpleicons.org mark, requested in white — see {@link themedIconUrl}. */
export const si = (slug: string) => `https://cdn.simpleicons.org/${slug}/white`;

/** skillicons.dev mark, already full-colour. */
export const skill = (slug: string) => `https://skillicons.dev/icons?i=${slug}`;

/**
 * Resolves a mark for the active theme. Only monochrome simpleicons URLs are
 * rewritten; everything else is returned untouched.
 */
export const themedIconUrl = (icon: string, isDark: boolean) =>
  !isDark && icon.includes("simpleicons.org")
    ? icon.replace("/white", "/black")
    : icon;

/**
 * Maps the tech names used in project data onto a mark. Missing entries render
 * as a plain text chip, so this does not need to be exhaustive.
 */
const TECH_ICONS: Record<string, string> = {
  Java: skill("java"),
  "Spring Boot": skill("spring"),
  Docker: skill("docker"),
  React: skill("react"),
  "React.js": skill("react"),
  "Node.js": skill("nodejs"),
  Express: skill("express"),
  "Express.js": skill("express"),
  MongoDB: skill("mongodb"),
  Redis: skill("redis"),
  BullMQ: skill("redis"),
  "Socket.io": skill("socketio"),
  JWT: skill("nodejs"),
  "Discord.js": skill("discord"),
  "Cloudflare R2": skill("cloudflare"),
  dns2: skill("nodejs"),
  dotenv: skill("nodejs"),
  Pathway: skill("py"),
  Gemini: skill("gcp"),
  "Google Calendar API": "https://cdn.simpleicons.org/googlecalendar",
  Resend: "https://cdn.simpleicons.org/resend",
  "Next.js": skill("nextjs"),
  TypeScript: skill("ts"),
  Bun: skill("bun"),
  PostgreSQL: skill("postgres"),
  "Drizzle ORM": si("drizzle"),
  Swift: skill("swift"),
  SwiftUI: skill("swift"),
  "whisper.cpp": skill("cpp"),
  MLX: si("apple"),
  "Llama 3.2": "https://cdn.simpleicons.org/meta",
  Metal: si("apple"),
  JavaScript: skill("js"),
  "Chrome Extension API": "https://cdn.simpleicons.org/googlechrome",
  "Mammoth.js": skill("js"),
  MutationObserver: si("mdnwebdocs"),
  Rust: skill("rust"),
  Cargo: si("rust"),
  // Nostr has no entry in skillicons/simpleicons, so the official CC0 mark
  // (github.com/mbarulli/nostr-logo) is vendored in /public. NIP-44 is a Nostr
  // spec, so it borrows the same mark.
  Nostr: "/tech-icons/nostr.svg",
  "NIP-44": "/tech-icons/nostr.svg",
  tokio: si("tokio"),
  Tokio: si("tokio"),
};

export const getTechIcon = (tech: string): string | null =>
  TECH_ICONS[tech] ?? null;
