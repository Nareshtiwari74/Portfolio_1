"use client";

import { Reveal } from "./Reveal";

/**
 * Block-level on-scroll reveal, with the same enter as every other reveal on
 * the site. For lists, prefer `Stagger` from `Reveal`.
 */
const FadeIn = ({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <Reveal delay={delay} className={className}>
    {children}
  </Reveal>
);

export default FadeIn;
