import { NextResponse } from "next/server";

import {
  isVisitorCounterConfigured,
  visitorCounter,
} from "@/lib/visitors/visitor-service";

const headers = { "Cache-Control": "no-store" };

export async function GET(req: Request) {
  if (!isVisitorCounterConfigured()) {
    return NextResponse.json(
      { count: null, message: "Visitor count unavailable" },
      { status: 503, headers },
    );
  }
  const { searchParams } = new URL(req.url);
  const uniqueId = searchParams.get("uniqueId");

  if (!uniqueId) {
    return NextResponse.json(
      {
        message: "uniqueId is required",
      },
      { status: 400, headers },
    );
  }

  if (
    uniqueId !== "noid" &&
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      uniqueId,
    )
  ) {
    return NextResponse.json(
      { count: null, clearId: true, message: "Invalid visitor ID" },
      { status: 400, headers },
    );
  }

  try {
    const result = await visitorCounter(uniqueId);

    return NextResponse.json(result, {
      status: result.found === false ? 404 : 200,
      headers,
    });
  } catch {
    return NextResponse.json(
      { count: null, message: "Visitor count unavailable" },
      { status: 503, headers },
    );
  }
}
