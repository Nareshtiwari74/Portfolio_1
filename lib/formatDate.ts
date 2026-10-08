/**
 * The one date format the site uses: "Jun 3, 2026". Everything that renders a
 * timestamp — pull requests, guestbook comments — goes through here so the
 * surfaces can't drift into three slightly different formats.
 */
export const formatDate = (iso: string | null | undefined) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";
