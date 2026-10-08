import { createHash, randomBytes } from "node:crypto";

import { NextResponse } from "next/server";

import {
  cookieOptions,
  guestbookConfigured,
  guestbookOrigin,
  json,
  OAUTH_COOKIE,
  safeReturnPath,
  signCookie,
} from "@/lib/guestbook/server";

export function GET(req: Request) {
  if (!guestbookConfigured())
    return json({ message: "Google sign-in is currently unavailable." }, 503);
  const state = randomBytes(32).toString("base64url");
  const verifier = randomBytes(32).toString("base64url");
  const returnPath = safeReturnPath(
    new URL(req.url).searchParams.get("returnTo"),
  );
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${guestbookOrigin()}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
    code_challenge: createHash("sha256").update(verifier).digest("base64url"),
    code_challenge_method: "S256",
  }).toString();
  const response = NextResponse.redirect(url);
  response.headers.set("Cache-Control", "no-store");
  response.cookies.set(
    OAUTH_COOKIE,
    signCookie({ purpose: "oauth", state, verifier, returnPath }, 600),
    cookieOptions(600),
  );
  return response;
}
