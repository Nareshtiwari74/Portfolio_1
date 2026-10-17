/**
 * The full-bleed dashed band that separates the home page's sections. Sits
 * absolutely inside a `relative` section wrapper, or occupies its own space
 * in the layout with `flow` so it follows content as the section changes.
 */
const POSITIONS = {
  top: "",
  bottom: "bottom-0",
  "bottom-1": "bottom-1",
  flow: "",
} as const;

const DashedRule = ({
  position = "top",
}: {
  position?: keyof typeof POSITIONS;
}) => (
  <div
    aria-hidden
    className={`border-line-strong pointer-events-none z-0 h-10 w-screen border border-x-0 border-dashed md:w-[125vw] dark:border-[#272727] ${position === "flow" ? "relative left-1/2 -translate-x-1/2" : "absolute left-0 md:left-1/2 md:-translate-x-1/2"} ${POSITIONS[position]}`}
  />
);

export default DashedRule;
