import { guestbookConfigured, json, sessionUser } from "@/lib/guestbook/server";

export async function GET() {
  if (!guestbookConfigured()) return json({ user: null, enabled: false }, 503);
  try {
    return json({ user: await sessionUser(), enabled: true });
  } catch {
    return json(
      { user: null, message: "Sign-in is currently unavailable." },
      503,
    );
  }
}
