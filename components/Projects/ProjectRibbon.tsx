/**
 * Diagonal ribbon pinned across the top-right corner of a project screenshot,
 * e.g. "55+ users". Meant to be rendered inside `ProjectImage`, which supplies
 * the positioning context and clips the ends of the band.
 *
 * Colours are fixed rather than themed: the ribbon always sits on top of a
 * light image gradient, so it reads the same in light and dark mode.
 *
 * Hovering the card sweeps a glare across the band — the `before` streak starts
 * off the left edge and slides past the right, clipped by the band itself.
 */
const ProjectRibbon = ({ label }: { label: string }) => (
  <div className="pointer-events-none absolute top-6 -right-16 z-10 w-56 rotate-45 overflow-hidden border-y border-dashed border-neutral-900/50 bg-[#FFD230] py-1 shadow-sm before:absolute before:inset-y-0 before:left-0 before:w-1/2 before:-translate-x-[150%] before:bg-linear-to-r before:from-transparent before:via-white/70 before:to-transparent before:transition-transform before:duration-700 before:ease-out before:content-[''] group-hover:before:translate-x-[250%]">
    <span className="relative flex items-center justify-center gap-1.5 text-[11px] font-bold tracking-wide whitespace-nowrap text-neutral-900">
      <span className="size-1.5 rounded-full bg-emerald-600" />
      {label}
    </span>
  </div>
);

export default ProjectRibbon;
