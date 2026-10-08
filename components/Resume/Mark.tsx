export function Mark({ children }: { children: React.ReactNode }) {
  return (
    <mark className="bg-brand text-brand-content rounded-sm px-[0.2em] not-italic">
      {children}
    </mark>
  );
}
