const SectionSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`mt-15 animate-pulse space-y-4 ${className}`} aria-hidden>
    <div className="bg-surface-strong h-4 w-24 rounded" />
    <div className="bg-surface-strong h-8 w-48 rounded" />
    <div className="bg-surface-raised h-40 w-full rounded-2xl" />
  </div>
);

export default SectionSkeleton;
