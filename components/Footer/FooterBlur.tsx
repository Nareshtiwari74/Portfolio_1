const FooterBlur = () => {
  return (
    // Mask and backdrop-blur must live on separate elements: applying both to the
    // same node makes iOS Safari render solid black instead of a blurred backdrop.
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-10 hidden h-[calc(3.125rem+env(safe-area-inset-bottom))] mask-[linear-gradient(to_top,black_50%,transparent)] select-none [-webkit-mask-image:linear-gradient(to_top,black_50%,transparent)] sm:block"
      style={{ userSelect: "none" }}
    >
      <div className="from-background absolute inset-0 bg-linear-to-t to-transparent backdrop-blur-[5px]" />
    </div>
  );
};

export default FooterBlur;
