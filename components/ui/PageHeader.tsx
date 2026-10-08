import { type ReactNode } from "react";

import { Stagger } from "@/components/ui/Reveal";

/**
 * The title block every top-level route opens with. Above the fold, so it
 * reveals on mount rather than on scroll.
 */
const PageHeader = ({
  title,
  children,
  className = "",
}: {
  title: string;
  /** Subtitle line under the title. */
  children: ReactNode;
  className?: string;
}) => (
  <Stagger immediate className={`flex flex-col gap-2 py-8 ${className}`}>
    <h1 className="sg-bold text-content text-[22px] leading-tight tracking-tight sm:text-[26px]">
      {title}
    </h1>
    <p className="sg-regular text-content-muted text-[14px]">{children}</p>
  </Stagger>
);

export default PageHeader;
