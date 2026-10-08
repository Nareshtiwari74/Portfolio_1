"use client";

import { useState } from "react";

import { motion, useReducedMotion } from "motion/react";

const j = (base: number, range = 1) =>
  +(base + (Math.random() - 0.5) * range * 2).toFixed(2);

const ScribbleUnderline = () => {
  // Drawing the stroke on is motion too, and pathLength is not a transform,
  // so MotionConfig would leave it running.
  const reduceMotion = useReducedMotion();

  const [path1] = useState(
    () =>
      `M0,${j(4, 0.5)} C8,${j(2.5)} 18,${j(4)} 30,${j(3)} C42,${j(4.5)} 54,${j(2.5)} 66,${j(4)} C76,${j(2.5)} 88,${j(4)} 97,${j(3)} C99,${j(3)} 100,${j(3.5, 0.5)}`,
  );

  const [path2] = useState(
    () =>
      `M1,${j(5, 0.5)} C12,${j(3.5)} 26,${j(5.5)} 40,${j(4)} C53,${j(5.5)} 65,${j(3.5)} 78,${j(5)} C87,${j(3.5)} 94,${j(5)} 99.5,${j(4, 0.5)}`,
  );

  return (
    <svg
      viewBox="0 0 100 14"
      className="absolute -bottom-1 left-0 h-3 w-full overflow-visible"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <motion.path
        d={path1}
        fill="none"
        className="stroke-scribble"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        suppressHydrationWarning
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.65, ease: "easeOut" }}
      />
      <motion.path
        d={path2}
        fill="none"
        className="stroke-scribble"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        suppressHydrationWarning
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ delay: 0.4, duration: 0.55, ease: "easeOut" }}
      />
    </svg>
  );
};

export default ScribbleUnderline;
