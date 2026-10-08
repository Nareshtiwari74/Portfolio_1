const HomeLoading = () => (
  <div className="mx-auto max-w-200 animate-pulse px-8 md:px-0">
    <div className="bg-surface-raised mt-12 mb-8 h-72 w-full rounded-[2rem] sm:h-80" />
    <div className="space-y-3">
      <div className="bg-surface-strong h-6 w-48 rounded" />
      <div className="bg-surface-raised h-4 w-full max-w-md rounded" />
    </div>
    <div className="mt-15 space-y-4">
      <div className="bg-surface-strong h-4 w-20 rounded" />
      <div className="bg-surface-strong h-8 w-40 rounded" />
      <div className="bg-surface-raised h-32 w-full rounded-2xl" />
    </div>
    <div className="mt-15 space-y-4">
      <div className="bg-surface-strong h-4 w-24 rounded" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="bg-surface-raised h-48 rounded-2xl" />
        <div className="bg-surface-raised h-48 rounded-2xl" />
      </div>
    </div>
  </div>
);

export default HomeLoading;
