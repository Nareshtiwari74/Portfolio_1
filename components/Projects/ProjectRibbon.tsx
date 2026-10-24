/**
 * Diagonal ribbon pinned across the top-left corner of a project screenshot,
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
  <div className="backend-ribbon pointer-events-none absolute top-4 -left-16 z-10 w-56 -rotate-45 overflow-hidden border-y border-neutral-900/30 bg-[#FFD230] py-2 shadow-md">
    <span className="relative z-10 flex items-center justify-center gap-1.5 text-xs font-bold tracking-widest whitespace-nowrap text-neutral-900 uppercase">
      <span className="size-1.5 rounded-full bg-emerald-600" />
      {label}
    </span>
  </div>
);

export default ProjectRibbon;
