"use client";

import { useCallback, useEffect, useRef } from "react";

import { useInView, useMotionValue, useSpring } from "motion/react";

interface CountUpProps {
  to: number;
  from?: number;
  direction?: "up" | "down";
  /** Seconds to wait after entering the viewport before counting starts. */
  delay?: number;
  /** Seconds the count takes; also sets the spring's stiffness and damping. */
  duration?: number;
  className?: string;
  startWhen?: boolean;
  /** Thousands separator; empty string leaves the number ungrouped. */
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

const decimalPlaces = (num: number) => {
  const [, decimals] = num.toString().split(".");
  return decimals && Number(decimals) !== 0 ? decimals.length : 0;
};

/**
 * Animates a number from `from` to `to` once it scrolls into view. Writes to
 * `textContent` directly rather than through state, so the spring can drive
 * every frame without re-rendering React.
 */
export default function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2,
  className = "",
  startWhen = true,
  separator = "",
  onStart,
  onEnd,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? to : from);

  const springValue = useSpring(motionValue, {
    damping: 20 + 40 * (1 / duration),
    stiffness: 100 * (1 / duration),
  });

  const isInView = useInView(ref, { once: true, margin: "0px" });

  const maxDecimals = Math.max(decimalPlaces(from), decimalPlaces(to));

  const formatValue = useCallback(
    (latest: number) => {
      const formatted = Intl.NumberFormat("en-US", {
        useGrouping: !!separator,
        minimumFractionDigits: maxDecimals,
        maximumFractionDigits: maxDecimals,
      }).format(latest);

      return separator ? formatted.replace(/,/g, separator) : formatted;
    },
    [maxDecimals, separator]
  );

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = formatValue(direction === "down" ? to : from);
    }
  }, [from, to, direction, formatValue]);

  useEffect(() => {
    if (!isInView || !startWhen) return;

    onStart?.();

    const startId = setTimeout(() => {
      motionValue.set(direction === "down" ? from : to);
    }, delay * 1000);

    const endId = setTimeout(() => onEnd?.(), (delay + duration) * 1000);

    return () => {
      clearTimeout(startId);
      clearTimeout(endId);
    };
  }, [
    isInView,
    startWhen,
    motionValue,
    direction,
    from,
    to,
    delay,
    duration,
    onStart,
    onEnd,
  ]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) ref.current.textContent = formatValue(latest);
      }),
    [springValue, formatValue]
  );

  return <span className={className} ref={ref} />;
}
