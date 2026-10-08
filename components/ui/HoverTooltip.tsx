/**
 * Small label that fades in above its trigger on hover. The trigger must be
 * marked `group` and establish a positioning context (`relative`).
 */
const HoverTooltip = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-surface-float text-content-secondary pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 rounded-lg border text-center whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${className}`}
  >
    {children}
    {/* Arrow */}
    <div className="bg-surface-float absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 border-r border-b" />
  </div>
);

export default HoverTooltip;
