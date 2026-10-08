"use client";

import Image from "next/image";

import { useTheme } from "@/hooks/ThemeProvider";
import { getTechIcon, themedIconUrl } from "@/lib/techIcons";

/**
 * Shared tech chip for the project card and the project modal, so both render
 * the same icon set instead of drifting apart.
 */
const TechBadge = ({ tech }: { tech: string }) => {
  const { isDark } = useTheme();
  const icon = getTechIcon(tech);

  return (
    <span className="bg-surface-raised text-content-secondary inline-flex h-fit items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs">
      {icon && (
        <Image
          src={themedIconUrl(icon, isDark)}
          alt={tech}
          width={12}
          height={12}
          className="h-3 w-3"
          unoptimized
        />
      )}
      {tech}
    </span>
  );
};

export default TechBadge;
