"use client";

import { useEffect } from "react";

import { useTheme } from "@/hooks/ThemeProvider";
import { playSound } from "@/lib/sound-engine";
import { click003Sound } from "@/lib/sounds/click-003";

/** Binds `p` to the theme toggle. Renders nothing. */
const PClick = () => {
  const { toggleTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "p") return;
      // Leave ⌘P / Ctrl+P (print) alone, and never steal a "p" typed into the
      // guestbook or any other field.
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat)
        return;
      const target = event.target as HTMLElement | null;
      if (
        target?.isContentEditable ||
        target?.closest("input, textarea, select")
      )
        return;
      void playSound(click003Sound.dataUri, { volume: 0.5 });
      toggleTheme();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleTheme]);

  return null;
};

export default PClick;
