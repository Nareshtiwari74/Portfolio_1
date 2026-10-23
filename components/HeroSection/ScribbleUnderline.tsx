"use client";

import { motion, useReducedMotion } from "motion/react";

// Fixed hand-drawn paths keep server HTML and client hydration identical.
const PATH_1 =
  "M0,4.2 C8,1.8 18,4.6 30,2.7 C42,5.1 54,2 66,4.4 C76,2.2 88,4.7 97,2.8 C99,3.4 100,3.6";
const PATH_2 =
  "M1,5.2 C12,3 26,6 40,3.7 C53,5.9 65,2.8 78,5.4 C87,3.1 94,5.6 99.5,4.2";

const ScribbleUnderline = () => {
  const reduceMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 100 14"
      className="absolute -bottom-1 left-0 h-3 w-full overflow-visible"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <motion.path
        d={PATH_1}
        fill="none"
        className="stroke-scribble"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.65, ease: "easeOut" }}
      />
      <motion.path
        d={PATH_2}
        fill="none"
        className="stroke-scribble"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ delay: 0.4, duration: 0.55, ease: "easeOut" }}
      />
    </svg>
  );
};

export default ScribbleUnderline;
