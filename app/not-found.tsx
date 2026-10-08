"use client";

import Link from "next/link";

import { Home } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { revealHidden, revealShown } from "@/components/ui/Reveal";

export default function NotFound() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative flex min-h-[calc(100dvh-160px)] flex-col items-center justify-center overflow-hidden px-8">
      {/* Watermark */}
      <div
        aria-hidden
        className="text-content/[0.035] pointer-events-none absolute leading-none font-black select-none"
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: "clamp(10rem, 38vw, 26rem)",
        }}
      >
        404
      </div>

      <motion.div
        initial={revealHidden}
        animate={revealShown(reduceMotion)}
        className="relative z-10 flex flex-col items-center gap-3 text-center"
      >
        <span
          className="text-content-subtle text-[11px] font-semibold tracking-[0.18em] uppercase"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          Error 404
        </span>

        <h1 className="text-content text-3xl font-bold tracking-tight">
          Page not found
        </h1>

        <p
          className="text-content-subtle text-xl"
          style={{ fontFamily: "var(--font-caveat)" }}
        >
          looks like this page took a wrong turn.
        </p>

        <div className="mt-5">
          <Link
            href="/"
            className="btn-chunky flex cursor-pointer items-center gap-2 rounded-lg py-[10px] ps-4.5 pe-5 text-sm font-medium"
          >
            <Home size={14} />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
