/**
 * The full-bleed dashed band that separates the home page's sections. Sits
 * absolutely inside a `relative` section wrapper; `position` picks which edge
 * of that wrapper it hangs from.
 */
const POSITIONS = {
  top: "",
  bottom: "bottom-0",
  "bottom-1": "bottom-1",
  "bottom-63": "bottom-70 md:bottom-63",
} as const;

const DashedRule = ({
  position = "top",
}: {
  position?: keyof typeof POSITIONS;
}) => (
  <div
    aria-hidden
    className={`border-line-strong absolute left-0 z-99 h-10 w-screen border border-x-0 border-dashed md:left-1/2 md:w-[125vw] md:-translate-x-1/2 dark:border-[#272727] ${POSITIONS[position]}`}
  />
);

export default DashedRule;
