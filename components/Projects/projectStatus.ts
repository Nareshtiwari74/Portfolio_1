/**
 * Maps a project's free-form `status` string onto the colours the card and the
 * modal both render. A supplied live link gets the Live label without claiming
 * a health check. Other unknown statuses fall through to "down".
 */
export type ProjectStatusTone = {
  /** Short label for the card, e.g. "Live". */
  label: string;
  /** Class for the dot. */
  dot: string;
  /** Class for the label text. */
  text: string;
  /** Classes for the pill in the modal (border + background + text). */
  pill: string;
};

const OPERATIONAL: ProjectStatusTone = {
  label: "Live",
  dot: "bg-success",
  text: "text-success-content",
  pill: "border-success-line bg-success-surface text-success-content",
};

const BETA: ProjectStatusTone = {
  label: "Beta",
  dot: "bg-warning",
  text: "text-warning-content",
  pill: "border-warning-line bg-warning-surface text-warning-content",
};

const DOWN: ProjectStatusTone = {
  label: "Down",
  dot: "bg-danger",
  text: "text-danger-content",
  pill: "border-danger-line bg-danger-surface text-danger-content",
};

export const getStatusTone = (status: string): ProjectStatusTone => {
  if (
    status === "Live" ||
    status === "All Systems Operational" ||
    status === "Live link available"
  )
    return OPERATIONAL;
  if (status.toLowerCase().includes("beta")) return BETA;
  return DOWN;
};
