"use client";

import { MotionConfig } from "motion/react";

/**
 * Honours `prefers-reduced-motion` for every `motion.*` element on the site:
 * transform and layout animations are skipped, opacity still fades. Anything
 * that animates `filter` has to branch on `useReducedMotion()` itself, since
 * MotionConfig leaves blur running.
 */
const MotionProvider = ({ children }: { children: React.ReactNode }) => (
  <MotionConfig reducedMotion="user">{children}</MotionConfig>
);

export default MotionProvider;
