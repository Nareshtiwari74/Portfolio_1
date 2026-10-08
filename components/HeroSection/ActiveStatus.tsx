"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { Clock } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { createMemoryCache } from "@/lib/memoryCache";
import { integrationConfig } from "@/lib/site";
import type { DiscordStatus, LanyardResponse } from "@/types/discord";
import type { CodeTime } from "@/types/wakatime";

const LANYARD_URL = integrationConfig.discordUserId
  ? `https://api.lanyard.rest/v1/users/${integrationConfig.discordUserId}`
  : "";

const REFRESH_MS = 120_000;

const statusCache = createMemoryCache<DiscordStatus>(60_000);

const STATUS_TONES: Record<
  DiscordStatus,
  { color: string; glow: string; label: string }
> = {
  online: { color: "bg-success", glow: "bg-success/20", label: "Online" },
  idle: { color: "bg-warning", glow: "bg-warning/20", label: "Idle" },
  dnd: { color: "bg-danger", glow: "bg-danger/20", label: "Do Not Disturb" },
  offline: {
    color: "bg-content-subtle",
    glow: "bg-content-subtle/20",
    label: "Offline",
  },
};

/**
 * Discord presence and coding time refresh on the client. WakaTime credentials
 * stay on the server; only the coding total is exposed by the local API.
 */
type Morph = { x: number; y: number; clip: string };

const CARD_RADIUS = 12;
// Pushes the fully open clip past the card edges so its shadow is not cut off.
const CLIP_BLEED = 24;
const OPEN_CLIP = `inset(${-CLIP_BLEED}px ${-CLIP_BLEED}px ${-CLIP_BLEED}px ${-CLIP_BLEED}px round ${CARD_RADIUS + CLIP_BLEED}px)`;

const cardVariants: Variants = {
  hidden: ({ x, y, clip }: Morph) => ({
    x,
    y,
    clipPath: clip,
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 35,
      opacity: { delay: 0.12, duration: 0.1 },
    },
    transitionEnd: { visibility: "hidden" },
  }),
  shown: {
    x: 0,
    y: 0,
    clipPath: OPEN_CLIP,
    opacity: 1,
    visibility: "visible",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 26,
      opacity: { duration: 0.05 },
    },
  },
};

const contentVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(4px)", transition: { duration: 0.1 } },
  shown: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.2, delay: 0.1 },
  },
};

/** Reduced motion: the card fades in place, with no morph from the dot. */
const fadeCardVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: { duration: 0.15, ease: "easeOut" },
    transitionEnd: { visibility: "hidden" },
  },
  shown: {
    x: 0,
    y: 0,
    clipPath: OPEN_CLIP,
    opacity: 1,
    visibility: "visible",
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

async function fetchStatus(): Promise<DiscordStatus | null> {
  if (!LANYARD_URL) return null;
  try {
    const res = await fetch(LANYARD_URL, {
      cache: "no-store",
      signal:
        typeof AbortSignal.timeout === "function"
          ? AbortSignal.timeout(10_000)
          : undefined,
    });
    if (!res.ok) return null;
    const body = (await res.json()) as LanyardResponse;
    const status = body?.data?.discord_status;
    return body.success === true &&
      status &&
      Object.hasOwn(STATUS_TONES, status)
      ? status
      : null;
  } catch {
    return null;
  }
}

const ActiveStatus = ({ codeTime }: { codeTime: CodeTime | null }) => {
  const cardId = useId();
  const reduceMotion = useReducedMotion();
  const [isDisplaying, setIsDisplaying] = useState(false);
  const [currentCodeTime, setCurrentCodeTime] = useState<Pick<
    CodeTime,
    "hours" | "minutes"
  > | null>(codeTime);
  const [status, setStatus] = useState<DiscordStatus | null>(() =>
    statusCache.get(),
  );

  useEffect(() => {
    if (!LANYARD_URL) return;
    let timeoutId: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const tick = async () => {
      const cached = statusCache.get();
      const next = cached ?? (await fetchStatus());
      if (cancelled) return;

      if (!cached && next) statusCache.set(next);
      if (!next) statusCache.clear();
      setStatus(next);
      timeoutId = setTimeout(tick, REFRESH_MS);
    };

    tick();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const controller = new AbortController();

    const tick = async () => {
      let enabled = true;
      try {
        const res = await fetch("/api/wakatime/today", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Coding time unavailable");
        const body = (await res.json()) as {
          enabled: boolean;
          codeTime: Pick<CodeTime, "hours" | "minutes"> | null;
        };
        if (controller.signal.aborted) return;
        enabled = body.enabled;
        setCurrentCodeTime(body.codeTime);
      } catch {
        if (controller.signal.aborted) return;
        setCurrentCodeTime(null);
      }
      if (enabled) timeoutId = setTimeout(tick, 300_000);
    };

    tick();
    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  const dotRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [morph, setMorph] = useState<Morph>({ x: 0, y: 0, clip: OPEN_CLIP });

  /**
   * Collapses the card's clip to a dot-sized circle in its bottom-left corner
   * and offsets the card so that circle sits exactly on the status dot. Uses
   * offset* (layout, not transformed) so it reads true mid-animation.
   */
  const measure = useCallback(() => {
    const dot = dotRef.current;
    const card = cardRef.current;
    if (!dot || !card) return;

    const size = dot.offsetWidth;
    const dotCx = dot.offsetLeft + size / 2;
    const dotCy = dot.offsetTop + dot.offsetHeight / 2;
    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = card;

    setMorph({
      x: dotCx - (offsetLeft + size / 2),
      y: dotCy - (offsetTop + offsetHeight - size / 2),
      clip: `inset(${offsetHeight - size}px ${offsetWidth - size}px 0px 0px round ${size / 2}px)`,
    });
  }, []);

  useLayoutEffect(measure, [measure, currentCodeTime]);

  const show = () => {
    measure();
    setIsDisplaying(true);
  };

  const displayStatus = status;
  const { color, glow } = displayStatus
    ? STATUS_TONES[displayStatus]
    : STATUS_TONES.offline;
  const label = displayStatus
    ? STATUS_TONES[displayStatus].label
    : "Status unavailable";

  return (
    <>
      <button
        ref={dotRef}
        type="button"
        aria-label={label}
        aria-expanded={isDisplaying}
        aria-controls={cardId}
        aria-describedby={isDisplaying ? cardId : undefined}
        onMouseEnter={show}
        onMouseLeave={() => setIsDisplaying(false)}
        onFocus={show}
        onBlur={() => setIsDisplaying(false)}
        onClick={(event) => {
          event.stopPropagation();
          show();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") setIsDisplaying(false);
        }}
        className="border-line bg-surface-raised absolute right-1 bottom-1 z-10 h-2 w-2 rounded-full border-2 p-2 transition-[scale] duration-150 ease-out hover:scale-[0.96]"
      >
        <span
          className={`border-background absolute inset-0 m-auto size-2 rounded-full ${color}`}
        />
      </button>
      <motion.div
        id={cardId}
        role="tooltip"
        ref={cardRef}
        aria-hidden={!isDisplaying}
        custom={morph}
        variants={reduceMotion ? fadeCardVariants : cardVariants}
        initial="hidden"
        animate={isDisplaying ? "shown" : "hidden"}
        className="bg-surface/80 pointer-events-none absolute -bottom-2 left-[110px] z-20 w-max overflow-hidden rounded-xl border shadow-lg backdrop-blur-md"
      >
        <motion.div
          variants={reduceMotion ? undefined : contentVariants}
          className="flex flex-col gap-2 p-3"
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <div
                className={`absolute -inset-1 animate-pulse rounded-full ${glow}`}
              />
              <div className={`relative size-2 rounded-full ${color}`} />
            </div>
            <span className="text-content-muted text-xs font-semibold tracking-wider uppercase">
              {label}
            </span>
          </div>

          {currentCodeTime && (
            <div className="border-content/20 bg-content/5 flex items-center gap-2 rounded-lg border border-dashed px-2.5 py-1.5">
              <Clock size={13} className="text-content-muted" />
              <span className="text-content text-xs font-bold">
                {String(currentCodeTime.hours).padStart(2, "0")}h{" "}
                {String(currentCodeTime.minutes).padStart(2, "0")}m
              </span>
              <span className="text-content-subtle text-[10px]">
                coded today
              </span>
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
};

export default ActiveStatus;
