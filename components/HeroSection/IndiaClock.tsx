"use client";

import { useSyncExternalStore } from "react";

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

const subscribe = (onChange: () => void) => {
  const interval = setInterval(onChange, 1_000);
  return () => clearInterval(interval);
};

const getTime = () => formatter.format(Date.now());
// Keep the server output and hydration consistent, regardless of render time.
const getServerTime = () => null;

const IndiaClock = () => {
  const time = useSyncExternalStore(subscribe, getTime, getServerTime);

  return (
    <div className="text-content-muted inline-flex shrink-0 items-center gap-2 text-xs whitespace-nowrap">
      <span>India</span>
      <span aria-hidden="true">•</span>
      <time
        dateTime={time ?? undefined}
        title="India Standard Time (UTC+05:30)"
        className="inline-block w-[8ch] font-mono tabular-nums"
      >
        {time ?? "--:--:--"}
      </time>
    </div>
  );
};

export default IndiaClock;
