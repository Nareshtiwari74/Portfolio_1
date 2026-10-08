import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  cookieOptions,
  guestbookConfigured,
  guestbookOrigin,
  OAUTH_COOKIE,
  readCookie,
  safeReturnPath,
  SESSION_COOKIE,
  SESSION_SECONDS,
  signCookie,
} from "@/lib/guestbook/server";

export async function GET(req: Request) {
  const store = await cookies();
  const pending = readCookie(store.get(OAUTH_COOKIE)?.value, "oauth");
  const params = new URL(req.url).searchParams;
  const failure = () => {
    const response = NextResponse.redirect(
      new URL("/guestbook?authError=signin#comments", guestbookOrigin()),
    );
    response.cookies.set(OAUTH_COOKIE, "", cookieOptions(0));
    response.headers.set("Cache-Control", "no-store");
    return response;
  };
  if (
    !guestbookConfigured() ||
    !pending ||
    params.get("state") !== pending.state ||
    params.has("error") ||
    !params.get("code") ||
    typeof pending.verifier !== "string"
  )
    return failure();
  // Consume the browser's login state before any network or database work.
  store.delete(OAUTH_COOKIE);
  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: params.get("code")!,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${guestbookOrigin()}/api/auth/google/callback`,
        grant_type: "authorization_code",
        code_verifier: pending.verifier,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!tokenResponse.ok) return failure();
    const tokens = await tokenResponse.json();
    if (typeof tokens.access_token !== "string" || !tokens.access_token)
      return failure();
    const profileResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      },
    );
    if (!profileResponse.ok) return failure();
    const profile = await profileResponse.json();
    if (
      typeof profile.sub !== "string" ||
      !profile.sub ||
      typeof profile.email !== "string" ||
      !profile.email ||
      profile.email_verified !== true
    )
      return failure();
    const { prisma } = await import("@/lib/prisma");
    const identity = {
      email: profile.email,
      name:
        typeof profile.name === "string" && profile.name
          ? profile.name
          : profile.email.split("@")[0],
      picture:
        typeof profile.picture === "string" &&
        /^https:\/\/[^/]*googleusercontent\.com\//.test(profile.picture)
          ? profile.picture
          : "",
    };
    const user = await prisma.user.upsert({
      where: { googleId: profile.sub },
      create: { googleId: profile.sub, ...identity },
      update: identity,
    });
    const response = NextResponse.redirect(
      new URL(
        `${safeReturnPath(pending.returnPath)}#comments`,
        guestbookOrigin(),
      ),
    );
    response.cookies.set(
      SESSION_COOKIE,
      signCookie({ purpose: "session", userId: user.id }, SESSION_SECONDS),
      cookieOptions(SESSION_SECONDS),
    );
    response.cookies.set(OAUTH_COOKIE, "", cookieOptions(0));
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch {
    return failure();
  }
}
