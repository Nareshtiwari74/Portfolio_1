"use client";

import { useState } from "react";

import { AnimatePresence, motion } from "motion/react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useClickSound } from "@/hooks/useClickSound";
import type { CodeTime } from "@/types/wakatime";
import { siteConfig } from "@/lib/site";

import ActiveStatus from "./ActiveStatus";

const RIPPLES = [0, 0.15, 0.3];

/**
 * The handwritten note beside the avatar. Sits to the right on mobile and to
 * the left from `sm` up, with the arrow mirrored to match.
 */
const Annotation = ({
  text,
  className,
  delay,
  duration,
}: {
  text: string;
  className: string;
  delay: number;
  duration: number;
}) => (
  <motion.div
    className="pointer-events-none absolute top-1/2 left-[115%] flex -translate-y-1/2 items-center sm:right-[115%] sm:left-auto"
    initial={{ opacity: 0, x: 8 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 8, transition: { duration: 0.2 } }}
    transition={{ duration, delay, ease: "easeOut" }}
    style={{ rotate: "-5deg" }}
  >
    <span
      className={`flex w-max flex-row-reverse items-center gap-1 text-lg leading-none sm:flex-row ${className}`}
      style={{ fontFamily: "var(--font-caveat)" }}
    >
      {text}
      <svg
        width="30"
        height="18"
        viewBox="0 0 30 18"
        fill="none"
        aria-hidden="true"
        className="inline-block -rotate-12 transform-[scaleX(-1)] sm:rotate-12 sm:transform-[scaleX(1)]"
        style={{ verticalAlign: "middle" }}
      >
        <path
          d="M2 14 C6 6, 18 4, 26 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M21 3 L26 6 L22 11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </span>
  </motion.div>
);

const ProfileAvatar = ({ codeTime }: { codeTime: CodeTime | null }) => {
  const playClick = useClickSound("/click.mp3");
  const [easterState, setEasterState] = useState(false);
  const [sparkleKey, setSparkleKey] = useState(0);

  const handleClick = () => {
    playClick();
    setEasterState((prev) => !prev);
    setSparkleKey((k) => k + 1);
  };

  return (
    <motion.div
      onClick={handleClick}
      className="relative w-fit cursor-pointer"
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {/* Ripple burst on click */}
      {sparkleKey > 0 &&
        RIPPLES.map((delay, i) => (
          <motion.span
            key={`${sparkleKey}-${i}`}
            className="pointer-events-none absolute inset-0 z-20 rounded-full"
            style={{
              border: `2px solid ${easterState ? "var(--ripple-active)" : "var(--ripple)"}`,
            }}
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 0.7, delay, ease: "easeOut" }}
          />
        ))}

      {/* Avatar pops on toggle. The squash stays within 0.95–1.05 so it reads
          as a nudge rather than a rubber ball. */}
      <motion.div
        className="relative z-10"
        animate={
          easterState
            ? { scale: [1, 1.05, 0.97, 1.02, 1], rotate: [0, -6, 6, -3, 0] }
            : { scale: [1, 0.96, 1.02, 1], rotate: 0 }
        }
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Blue focus border + glow ring in easter state */}
        <AnimatePresence>
          {easterState && (
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: 0.95,
                transition: { duration: 0.15, ease: "easeOut" },
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{
                outline: "3px solid var(--ripple-active)",
                outlineOffset: "4px",
                boxShadow:
                  "0 0 0 6px var(--ripple-glow), 0 0 22px 6px var(--ripple-glow-wide)",
              }}
            />
          )}
        </AnimatePresence>

        <Avatar>
          <AvatarImage
            className="h-full w-full object-cover object-center"
            alt={`${siteConfig.name} avatar`}
            src={
              easterState ? siteConfig.easterEggImage : siteConfig.profileImage
            }
            loading="eager"
            fetchPriority="high"
          />
        </Avatar>
      </motion.div>

      {/* Handwritten annotation — hint before, reveal after */}
      <AnimatePresence mode="wait">
        {easterState ? (
          <Annotation
            key="found"
            text="you found me!"
            className="text-content-muted"
            delay={0.25}
            duration={0.4}
          />
        ) : (
          <Annotation
            key="hint"
            text="psst, click me!"
            className="text-content-subtle"
            delay={0.8}
            duration={0.5}
          />
        )}
      </AnimatePresence>

      <ActiveStatus codeTime={codeTime} />
    </motion.div>
  );
};

export default ProfileAvatar;
