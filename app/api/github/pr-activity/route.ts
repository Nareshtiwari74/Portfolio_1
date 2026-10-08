import { type NextRequest, NextResponse } from "next/server";

import {
  getPrActivity,
  GitHubApiError,
  isPrType,
} from "@/lib/github/github-service";

/**
 * Pull-request feed for the activity board and the Experience row. Route
 * Handlers are uncached by default; the service shares results and in-flight
 * requests for five minutes, and the browser caches successful results too.
 */
export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type");

  if (!isPrType(type)) {
    return NextResponse.json(
      { message: 'Type should be one of "opened", "merged", "closed"' },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json(await getPrActivity(type));
  } catch (err) {
    if (err instanceof GitHubApiError) {
      return NextResponse.json(
        { message: err.message },
        { status: err.status },
      );
    }

    console.error("Unhandled error in /api/github/pr-activity:", err);
    return NextResponse.json(
      { message: "Internal error fetching GitHub PR activity" },
      { status: 500 },
    );
  }
}
