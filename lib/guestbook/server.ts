import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { siteConfig } from "@/lib/site";

export const SESSION_COOKIE = "naresh_guestbook_session";
export const OAUTH_COOKIE = "naresh_guestbook_oauth";
export const SESSION_SECONDS = 7 * 24 * 60 * 60;

export const guestbookOrigin = () =>
  new URL(
    process.env.GUESTBOOK_ORIGIN ||
      (process.env.NODE_ENV === "production"
        ? siteConfig.baseUrl
        : "http://localhost:3000"),
  ).origin;

export const databaseConfigured = () =>
  Boolean(process.env.DATABASE_URL?.trim());
export const guestbookConfigured = () =>
  databaseConfigured() &&
  Boolean(process.env.GOOGLE_CLIENT_ID?.trim()) &&
  Boolean(process.env.GOOGLE_CLIENT_SECRET?.trim()) &&
  (process.env.GUESTBOOK_SESSION_SECRET?.length ?? 0) >= 32;

export const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: guestbookOrigin().startsWith("https:"),
  sameSite: "lax" as const,
  path: "/",
  maxAge,
});

export const json = (body: unknown, status = 200) =>
  NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });

export function signCookie(data: Record<string, unknown>, lifetime: number) {
  const secret = process.env.GUESTBOOK_SESSION_SECRET;
  if (!secret || secret.length < 32)
    throw new Error("Guestbook not configured");
  const payload = Buffer.from(
    JSON.stringify({ ...data, expires: Date.now() + lifetime * 1000 }),
  ).toString("base64url");
  const signature = createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

export function readCookie(value: string | undefined, purpose: string) {
  const secret = process.env.GUESTBOOK_SESSION_SECRET;
  if (!value || !secret || secret.length < 32) return null;
  try {
    const [payload, signature, extra] = value.split(".");
    if (!payload || !signature || extra) return null;
    const expected = createHmac("sha256", secret).update(payload).digest();
    const received = Buffer.from(signature, "base64url");
    if (
      expected.length !== received.length ||
      !timingSafeEqual(expected, received)
    )
      return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (
      data.purpose !== purpose ||
      !Number.isFinite(data.expires) ||
      data.expires <= Date.now()
    )
      return null;
    return data as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function sessionUser() {
  if (!guestbookConfigured()) return null;
  const data = readCookie(
    (await cookies()).get(SESSION_COOKIE)?.value,
    "session",
  );
  if (typeof data?.userId !== "string") return null;
  const { prisma } = await import("@/lib/prisma");
  return prisma.user.findUnique({ where: { id: data.userId } });
}

export const sameOrigin = (req: Request) =>
  req.headers.get("origin") === guestbookOrigin();
export const safeReturnPath = (value: unknown) =>
  value === "/" ? "/" : "/guestbook";
