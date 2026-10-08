"use client";

import { Children, type ReactNode } from "react";

import {
  motion,
  type Transition,
  useReducedMotion,
  type Variants,
} from "motion/react";

/** Opacity, 4px of blur and 12px of rise, settling over 300ms. */
const ENTER = { duration: 0.3, ease: "easeOut" } as const;

/** Seconds between semantic chunks such as title, description and actions. */
export const CHUNK_STAGGER = 0.1;
/** Seconds between items in a list or grid. */
export const ITEM_STAGGER = 0.05;

const hidden = { opacity: 0, y: 12, filter: "blur(4px)" };
const shown = { opacity: 1, y: 0, filter: "blur(0px)" };

/**
 * Under reduced motion only the fade runs; the rise and blur land instantly.
 * Both modes share the same start state, so the server render and the first
 * client render agree whatever the preference.
 */
const enterTransition = (
  reduceMotion: boolean | null,
  delay = 0
): Transition =>
  reduceMotion
    ? {
        opacity: { ...ENTER, delay },
        y: { duration: 0 },
        filter: { duration: 0 },
      }
    : { ...ENTER, delay };

/** The reveal's start state, for components that drive motion themselves. */
export const revealHidden = hidden;

/** The reveal's end state, starting after `delay` seconds. */
export const revealShown = (reduceMotion: boolean | null, delay = 0) => ({
  ...shown,
  transition: enterTransition(reduceMotion, delay),
});

/** Viewport config shared by every on-scroll reveal. */
export const revealViewport = { once: true, margin: "0px 0px -10% 0px" };

const revealVariants = (reduceMotion: boolean | null, delay = 0): Variants => ({
  hidden,
  show: revealShown(reduceMotion, delay),
});

const containerVariants = (stagger: number, delay: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

type StaggerProps = {
  children: ReactNode;
  /** Seconds between each child. */
  stagger?: number;
  /** Seconds before the first child starts. */
  delay?: number;
  className?: string;
  /** Applied to every generated child wrapper (e.g. `h-full` inside a grid). */
  itemClassName?: string;
  /** Animate on mount instead of waiting for the viewport. Use above the fold. */
  immediate?: boolean;
};

/**
 * Reveals its direct children one after another. Each child is wrapped in a
 * `motion.div`, so the wrapper's own `className` can carry the layout
 * (flex/grid) and the children stay the layout items.
 */
export const Stagger = ({
  children,
  stagger = CHUNK_STAGGER,
  delay = 0,
  className,
  itemClassName,
  immediate = false,
}: StaggerProps) => {
  const reduceMotion = useReducedMotion();

  const trigger = immediate
    ? { animate: "show" as const }
    : {
        whileInView: "show" as const,
        viewport: revealViewport,
      };

  return (
    <motion.div
      className={className}
      variants={containerVariants(stagger, delay)}
      initial="hidden"
      {...trigger}
    >
      {Children.toArray(children).map((child, index) => (
        <motion.div
          key={index}
          className={itemClassName}
          variants={revealVariants(reduceMotion)}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  immediate?: boolean;
};

/** Single-element version of {@link Stagger}. */
export const Reveal = ({
  children,
  delay = 0,
  className,
  immediate = false,
}: RevealProps) => {
  const reduceMotion = useReducedMotion();

  const trigger = immediate
    ? { animate: "show" as const }
    : {
        whileInView: "show" as const,
        viewport: revealViewport,
      };

  return (
    <motion.div
      className={className}
      variants={revealVariants(reduceMotion, delay)}
      initial="hidden"
      {...trigger}
    >
      {children}
    </motion.div>
  );
};

type RevealEachProps = {
  children: ReactNode;
  className?: string;
  /** Wrapper tag, so semantic markup like `<article>` survives. */
  as?: "div" | "article" | "section";
};

/**
 * Gives every direct child its own viewport observer, so each one reveals as
 * the reader reaches it. Use this instead of {@link Stagger} for content taller
 * than the viewport — a stagger container fires all of its children the moment
 * its own top edge crosses the trigger, which means everything below the fold
 * has already finished animating by the time you scroll to it.
 */
export const RevealEach = ({
  children,
  className,
  as: Tag = "div",
}: RevealEachProps) => (
  <Tag className={className}>
    {Children.toArray(children).map((child, index) => (
      <Reveal key={index}>{child}</Reveal>
    ))}
  </Tag>
);
