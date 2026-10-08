import { integrationConfig } from "@/lib/site";
import type { CodeTime } from "@/types/wakatime";

type SummariesResponse = {
  data: { grand_total: CodeTime; range: { date: string } }[];
};

// The home page is prerendered, so an uncached request here would freeze
// "today" at build time. Going through `fetch` puts the response in Next's
// data cache and re-renders the page on this interval instead.
const REVALIDATE_SECONDS = 300;

export const isWakaTimeConfigured = () =>
  (process.env.WAKATIME_ENABLED === "true" ||
    integrationConfig.activityEnabled) &&
  Boolean(process.env.WAKATIME_API_KEY);

/**
 * Today's coding total from WakaTime. Server-only — the API key never leaves
 * the server. Returns `null` on any failure so callers can just hide the row.
 */
export const todayTime = async (): Promise<CodeTime | null> => {
  if (!isWakaTimeConfigured()) return null;
  const apiKey = process.env.WAKATIME_API_KEY;
  if (!apiKey) return null;

  // WakaTime's Basic Auth expects the API key Base64 encoded.
  const encodedKey = Buffer.from(apiKey).toString("base64");
  try {
    const timeZone = process.env.WAKATIME_TIMEZONE?.trim() || "Asia/Kolkata";
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
    const url = new URL("https://wakatime.com/api/v1/users/current/summaries");
    url.search = new URLSearchParams({
      start: today,
      end: today,
      timezone: timeZone,
    }).toString();
    const res = await fetch(url, {
      headers: {
        Authorization: `Basic ${encodedKey}`,
        Accept: "application/json",
      },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      console.error("WakaTime API Error:", res.status);
      return null;
    }

    const body = (await res.json()) as SummariesResponse;
    const total = body.data?.find(
      (day) => day.range?.date === today,
    )?.grand_total;
    if (
      !total ||
      !Number.isInteger(total.hours) ||
      total.hours < 0 ||
      !Number.isInteger(total.minutes) ||
      total.minutes < 0 ||
      total.minutes > 59
    ) {
      return null;
    }
    return total;
  } catch (err) {
    console.error("WakaTime request failed:", err);
    return null;
  }
};
