"use client";

import Image from "next/image";

import HoverTooltip from "@/components/ui/HoverTooltip";
import { useTheme } from "@/hooks/ThemeProvider";
import { techStack as confirmedTechStack } from "@/lib/personal-content";
import { themedIconUrl } from "@/lib/techIcons";

export const techStack = confirmedTechStack;

const TechStack = () => {
  const { isDark } = useTheme();

  return (
    <section className="mx-auto mt-8 flex w-full max-w-200 flex-col space-y-6 px-8 md:px-0">
      {/* Header */}
      <div>
        <p className="text-content-muted mb-1 text-sm">Expertise</p>
        <h2 className="flex items-center gap-2 text-3xl font-bold">
          Tech Stack & Tools
        </h2>
      </div>
      <div className="flex w-full flex-wrap justify-evenly gap-3">
        {techStack.map((tech) => (
          <div key={tech.name} className="group relative">
            {/* Icon Container */}
            <div className="bg-surface-raised flex h-12 w-12 items-center justify-center rounded-xl border">
              <Image
                src={themedIconUrl(tech.icon, isDark)}
                alt={tech.name}
                width={24}
                height={24}
                className="h-6 w-6 rounded-sm"
                unoptimized
              />
            </div>

            <HoverTooltip className="-top-14 px-3 py-2 text-xs">
              <div className="text-content mb-0.5 font-bold">{tech.name}</div>
              <div className="text-content-muted text-[10px] font-medium">
                {tech.desc}
              </div>
            </HoverTooltip>
          </div>
        ))}
      </div>

      <div className="h-10" />
    </section>
  );
};

export default TechStack;
