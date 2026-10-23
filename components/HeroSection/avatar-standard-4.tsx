"use client";

import { useState } from "react";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useClickSound } from "@/hooks/useClickSound";
import type { CodeTime } from "@/types/wakatime";
import { siteConfig } from "@/lib/site";

import ActiveStatus from "./ActiveStatus";

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
  const reduceMotion = useReducedMotion();

  const handleClick = () => {
    playClick();
    setEasterState((prev) => !prev);
  };

  return (
    <div className="relative w-fit">
      <button
        type="button"
        onClick={handleClick}
        aria-label="Show alternate profile photo"
        aria-pressed={easterState}
        className="block cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        <Avatar className="overflow-visible bg-transparent">
          {[siteConfig.profileImage, siteConfig.easterEggImage].map(
            (src, imageIndex) => {
              const active = easterState === (imageIndex === 1);
              return (
                <span
                  key={src}
                  className="absolute inset-0 grid grid-cols-12 grid-rows-12"
                  aria-hidden={!active}
                >
                  {Array.from({ length: 144 }, (_, index) => {
                    const column = index % 12;
                    const row = Math.floor(index / 12);
                    const order = (index * 53) % 144;
                    const angle = ((index * 137.5) / 180) * Math.PI;
                    const distance = 20 + ((index * 17) % 45);
                    return (
                      <motion.span
                        key={index}
                        className="relative overflow-hidden"
                        initial={false}
                        animate={{
                          opacity: active ? 1 : 0,
                          x:
                            active || reduceMotion
                              ? 0
                              : Math.cos(angle) * distance,
                          y:
                            active || reduceMotion
                              ? 0
                              : Math.sin(angle) * distance,
                          rotate:
                            active || reduceMotion
                              ? 0
                              : ((index * 29) % 180) - 90,
                          scale: active || reduceMotion ? 1 : 0.35,
                        }}
                        transition={{
                          duration: reduceMotion ? 0 : active ? 0.8 : 0.6,
                          ease: active ? "easeOut" : "easeIn",
                          delay: reduceMotion
                            ? 0
                            : (order / 143) * 0.18 + (active ? 0.27 : 0),
                        }}
                      >
                        <AvatarImage
                          alt={
                            index === 0
                              ? `${siteConfig.name} profile photo`
                              : ""
                          }
                          src={src}
                          loading="eager"
                          className="absolute max-w-none rounded-full object-cover object-center"
                          style={{
                            width: "1200%",
                            height: "1200%",
                            left: `${-column * 100}%`,
                            top: `${-row * 100}%`,
                          }}
                        />
                      </motion.span>
                    );
                  })}
                </span>
              );
            },
          )}
        </Avatar>
      </button>

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
    </div>
  );
};

export default ProfileAvatar;
