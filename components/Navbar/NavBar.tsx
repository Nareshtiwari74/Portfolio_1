"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Dot, Moon, Sun } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import PClick from "@/components/keyboard-toggles/PClick";
import { useTheme } from "@/hooks/ThemeProvider";
import { playSound } from "@/lib/sound-engine";
import { click003Sound } from "@/lib/sounds/click-003";
import { siteConfig } from "@/lib/site";

/**
 * `dotLeft` is the indicator's horizontal position as a percentage of the nav
 * width, tuned to where each label sits in the desktop row. It lives on the
 * link so the two can't drift apart the way a separate lookup table would.
 */
const NAV_LINKS = [
  { href: "/projects", label: "Projects", segment: "projects", dotLeft: 11.3 },
  {
    href: "/Shenanigans",
    label: "Shenanigans",
    segment: "Shenanigans",
    dotLeft: 25.5,
  },
  { href: "/blogs", label: "Blogs", segment: "blogs", dotLeft: 37 },
  {
    href: "/guestbook",
    label: "GuestBook",
    segment: "guestbook",
    dotLeft: 48.5,
  },
  { href: "/resume", label: "Resume", segment: "resume", dotLeft: 61 },
];

const ICON_HIDDEN = { opacity: 0, scale: 0.25, filter: "blur(4px)" };
const ICON_SHOWN = { opacity: 1, scale: 1, filter: "blur(0px)" };

/**
 * Cross-fading icon swap for the theme button: the outgoing icon shrinks and
 * blurs away while the incoming one grows in over it. Reduced motion keeps the
 * fade alone.
 */
const SwapIcon = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const reduceMotion = useReducedMotion();
  const hidden = reduceMotion ? { opacity: 0 } : ICON_HIDDEN;

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={id}
        initial={hidden}
        animate={reduceMotion ? { opacity: 1 } : ICON_SHOWN}
        exit={hidden}
        transition={{ type: "spring", duration: 0.3, bounce: 0 }}
        style={{ display: "flex" }}
      >
        {children}
      </motion.span>
    </AnimatePresence>
  );
};

// Bars rotate around the viewBox centre (8,8) rather than their own boxes,
// which is what lets the two short bars meet as one diagonal of the X.
const BAR_STYLE = {
  transformBox: "view-box",
  originX: 0.5,
  originY: 0.5,
} as const;
// Critically damped (damping = 2√stiffness): the bars land without overshoot.
const BAR_SPRING = { type: "spring", stiffness: 400, damping: 40 } as const;

/**
 * Staggered hamburger that morphs into an X: the full-width middle bar becomes
 * one diagonal and the two short bars swing in to form the other.
 */
const MenuIcon = ({ open }: { open: boolean }) => (
  <svg
    aria-hidden="true"
    className="pointer-events-none size-4.5 fill-current"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.rect
      y="7"
      width="9"
      height="2"
      rx="1"
      style={BAR_STYLE}
      initial={false}
      animate={open ? { x: 0, y: 0, rotate: 315 } : { x: 7, y: -5, rotate: 0 }}
      transition={BAR_SPRING}
    />
    <motion.rect
      y="7"
      width="16"
      height="2"
      rx="1"
      style={BAR_STYLE}
      initial={false}
      animate={{ rotate: open ? 45 : 0 }}
      transition={BAR_SPRING}
    />
    <motion.rect
      y="7"
      width="9"
      height="2"
      rx="1"
      style={BAR_STYLE}
      initial={false}
      animate={open ? { y: 0, rotate: 135 } : { y: 5, rotate: 0 }}
      transition={BAR_SPRING}
    />
  </svg>
);

const NavBar = () => {
  const { isDark, toggleTheme } = useTheme();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const [hoveringTheme, setHoveringTheme] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  const activeLink = NAV_LINKS.find(
    (link) => link.segment === pathname.split("/").filter(Boolean)[0],
  );

  // Close the mobile menu on navigation, during render rather than in an
  // effect: the new route and the closed menu then paint in the same commit.
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  return (
    <>
      <PClick />

      <div className="border-line-strong sticky top-0 z-100 border-b border-dashed">
        <nav className="relative mx-auto flex w-full max-w-165 items-center justify-between px-8 pt-2 pb-1 md:px-0">
          {activeLink && (
            <motion.div
              className="absolute hidden sm:block"
              animate={{ left: `${activeLink.dotLeft}%` }}
              // `left` is not a transform, so MotionConfig's reduced-motion
              // switch does not cover it.
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 400, damping: 30 }
              }
            >
              <Dot />
            </motion.div>
          )}

          <div className="bg-surface/10 absolute inset-0 top-0 -z-99 mask-[linear-gradient(to_bottom,black_50%,transparent)] backdrop-blur-[5px]" />
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/"
              className="bg-brand border-on-media flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-xl border transition-[scale] duration-150 ease-out hover:scale-[0.96] active:scale-[0.96]"
            >
              <Image
                src={siteConfig.profileImage}
                alt={`${siteConfig.name} avatar`}
                width={60}
                height={60}
                priority
                fetchPriority="high"
              />
            </Link>
            <div className="font-md font-sm mt-8 hidden gap-4 self-end text-[16px] md:flex">
              {NAV_LINKS.map(({ href, label }) => (
                <Link key={href} className="hover:underline" href={href}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                // Mouse only: a tap fires pointerenter too, and the hint would
                // then stay stuck open on a touch screen.
                onPointerEnter={(e) =>
                  e.pointerType === "mouse" && setHoveringTheme(true)
                }
                onPointerLeave={() => setHoveringTheme(false)}
                onClick={() => {
                  void playSound(click003Sound.dataUri, { volume: 0.5 });
                  toggleTheme();
                }}
                className="btn-chunky text-content-muted cursor-pointer rounded-lg p-3 sm:p-[10px]"
                aria-label="Toggle theme"
              >
                <SwapIcon id={isDark ? "sun" : "moon"}>
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </SwapIcon>
              </button>
              <AnimatePresence>{hoveringTheme && <InfoPill />}</AnimatePresence>
            </div>

            <button
              onClick={() => setMenuOpen((open) => !open)}
              className="btn-chunky text-content-muted cursor-pointer rounded-lg p-3 sm:p-[10px] md:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: -12,
                transition: { duration: 0.15, ease: "easeOut" },
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              // Outer radius = link radius (10px) + padding (12px) + border.
              className="border-line bg-surface-panel/95 absolute top-full right-4 left-4 z-50 mt-2 flex flex-col gap-1 rounded-[23px] border p-3 shadow-lg backdrop-blur-md md:hidden"
            >
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="text-content hover:bg-surface-raised rounded-lg px-3 py-2 text-[16px] font-medium transition-colors"
                >
                  {label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const InfoPill = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.15, ease: "easeOut" }}
    exit={{ opacity: 0, transition: { duration: 0.1, ease: "easeOut" } }}
    className="info-pill border-line-strong bg-surface text-content absolute top-10 -right-15 hidden w-40 scale-75 items-center justify-center gap-2 rounded-xl border p-2 sm:flex"
  >
    <p>Toggle Mode </p>
    <span className="border-line-strong bg-surface-inverted text-content-inverted rounded-md border-2 px-2">
      P
    </span>
  </motion.div>
);

export default NavBar;
