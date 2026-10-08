"use client";

import { useEffect, useState } from "react";

import { Eye } from "lucide-react";

import CountUp from "@/components/CountUp";

const COUNTER_URL = `/api/visitors`;
const STORAGE_KEY = "nareshPortfolio.visitorId";

let pendingCount: Promise<number | null> | null = null;

async function requestCount(): Promise<number | null> {
  try {
    let uniqueId = localStorage.getItem(STORAGE_KEY) ?? "noid";

    for (let attempt = 0; attempt < 2; attempt++) {
      const res = await fetch(
        `${COUNTER_URL}?uniqueId=${encodeURIComponent(uniqueId)}`,
        { cache: "no-store" },
      );
      const data = await res.json();
      if (!data) return null;
      if (data.clearId) {
        localStorage.removeItem(STORAGE_KEY);
        if (attempt === 0) {
          uniqueId = "noid";
          continue;
        }
        return null;
      }
      if (!res.ok) return null;
      if (data.visitorId) localStorage.setItem(STORAGE_KEY, data.visitorId);
      return typeof data.count === "number" &&
        Number.isSafeInteger(data.count) &&
        data.count >= 0
        ? data.count
        : null;
    }
  } catch {
    // An unavailable counter leaves its count unknown.
  }
  return null;
}

const loadCount = () => {
  // Share the request across simultaneous mounts, including development's
  // Strict Mode effect replay, to register a new browser only once.
  pendingCount ??= requestCount().finally(() => {
    pendingCount = null;
  });
  return pendingCount;
};

export const VisitorCounter = () => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadCount().then((value) => {
      if (!cancelled && value !== null) setCount(value);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (count === null) return null;

  return (
    <div className="bg-surface-raised shadow-chunky mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5">
      <Eye size={13} className="text-content-muted" />
      <span className="text-content-secondary text-xs font-semibold tabular-nums">
        <CountUp
          from={0}
          to={count}
          separator=","
          direction="up"
          duration={1.2}
          startWhen={true}
        />
      </span>
      <span className="text-content-muted text-xs">visitors</span>
    </div>
  );
};
