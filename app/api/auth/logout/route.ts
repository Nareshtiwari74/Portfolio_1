import {
  cookieOptions,
  json,
  sameOrigin,
  SESSION_COOKIE,
} from "@/lib/guestbook/server";

export function POST(req: Request) {
  if (!sameOrigin(req)) return json({ message: "Invalid request origin" }, 403);
  const response = json({ signedOut: true });
  response.cookies.set(SESSION_COOKIE, "", cookieOptions(0));
  return response;
}
