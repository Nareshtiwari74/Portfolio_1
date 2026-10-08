import posthog from "posthog-js";

const token = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (token && host) {
  posthog.init(token, {
    api_host: host,
    defaults: "2026-01-30",
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
  });
}

// IMPORTANT: Never combine this approach with other client-side PostHog
// initialization approaches, especially components like a PostHogProvider.
// instrumentation-client.ts is the correct solution for initializing
// client-side PostHog in Next.js 15.3+ apps.
