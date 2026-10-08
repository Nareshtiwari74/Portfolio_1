"use client";

import { ExternalLink, Hash } from "lucide-react";
import { motion } from "motion/react";

const AchievmentCard = () => {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="group border-line-bold bg-surface-subtle hover:border-info/50 relative overflow-hidden rounded-2xl border p-6 transition-[border-color] duration-150 ease-out"
    >
      <span className="pointer-events-none absolute -right-2 -bottom-4 font-sans text-[120px] leading-none font-black italic opacity-[0.03] transition-opacity group-hover:opacity-[0.06]">
        3
      </span>

      <div className="relative z-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="bg-info h-2 w-2 animate-pulse rounded-full" />
              <span className="text-info-content font-mono text-[10px] font-bold tracking-widest uppercase">
                Top 3 Finish
              </span>
            </div>

            <h3 className="text-3xl font-black tracking-tighter uppercase italic">
              Coding Contest
            </h3>

            <p className="text-content-muted font-mono text-xs tracking-wider uppercase">
              GeeksforGeeks × LPU
            </p>
          </div>

          <div className="flex flex-col md:items-end">
            <div className="flex items-baseline gap-1 font-mono text-2xl font-black">
              <span className="text-info-content text-sm italic">Top</span>3
              <span className="text-content-muted ml-2 text-xs font-normal tracking-normal italic">
                / 500+ Participants
              </span>
            </div>
            <p className="bg-surface-strong mt-1 self-start px-2 py-0.5 font-mono text-[10px] md:self-end">
              CODING CONTEST
            </p>
          </div>
        </div>

        <p className="border-line-bold mt-6 max-w-2xl border-l pl-4 text-sm leading-relaxed">
          Top 3 among 500+ participants in the GeeksforGeeks × LPU coding
          contest.
        </p>

        {/* Footer: Fixed position, reveals on Parent Hover */}
        <motion.div
          variants={{
            rest: { opacity: 0.4, y: 5 },
            hover: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="border-line-bold/50 mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t pt-6"
        >
          <a
            href="https://drive.google.com/file/d/1L2FtumTc-rNJgqmjqnR-Ln7zdI37W5wz/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="group/link text-info-content/80 hover:text-info-content flex items-center gap-2 font-mono text-[11px] font-bold transition-colors"
          >
            <ExternalLink
              size={14}
              className="transition-transform duration-150 ease-out group-hover/link:scale-105"
            />
            View Achievement
          </a>

          <div className="text-content-secondary flex items-center gap-2 font-mono text-[10px]">
            <Hash size={12} className="opacity-50" />
            <span>GeeksforGeeks × LPU</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AchievmentCard;
