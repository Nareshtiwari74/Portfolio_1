import { guestbookConfigured, json } from "@/lib/guestbook/server";

export function GET() {
  return json({ enabled: guestbookConfigured() });
}
