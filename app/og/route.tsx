import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

import { siteConfig } from "@/lib/site";

export const runtime = "nodejs";

/**
 * Palette mirrors the dark theme in `app/theme.css` so a shared link looks like
 * a slice of the site rather than a separate brand.
 */
const C = {
  bg: "#100e0e",
  text: "#ffffff",
  secondary: "#a3a3a3",
  muted: "#737373",
  line: "#262626",
  brand: "#fcd34d",
  pillBorder: "rgba(255,255,255,0.14)",
  pillBg: "rgba(255,255,255,0.05)",
};

const truncate = (str: string, max: number) =>
  str.length > max ? str.slice(0, max - 1).trimEnd() + "…" : str;

function param(
  params: URLSearchParams,
  key: string,
  fallback: string,
  max: number,
) {
  return truncate(params.get(key) ?? fallback, max);
}

/** Long titles step down a size instead of wrapping into a third line. */
const titleSize = (title: string) =>
  title.length > 54 ? 50 : title.length > 34 ? 58 : 68;

// Fonts and the avatar never change at runtime — load them once per server
// process instead of on every request, since crawlers (Twitterbot especially)
// give the endpoint a short timeout.
let assetCache: Promise<{
  geistRegular: Buffer;
  geistMedium: Buffer;
  geistBold: Buffer;
  monoMedium: Buffer;
  logoSrc: string;
}> | null = null;

async function loadAssets() {
  const { readFile } = await import("fs/promises");
  const { join } = await import("path");

  const font = (name: string) =>
    readFile(join(process.cwd(), "app/og/fonts", name));

  const [geistRegular, geistMedium, geistBold, monoMedium, logo] =
    await Promise.all([
      font("Geist-Regular.ttf"),
      font("Geist-Medium.ttf"),
      font("Geist-Bold.ttf"),
      font("GeistMono-Medium.ttf"),
      readFile(join(process.cwd(), "app/og/assets/logo.jpg")),
    ]);

  return {
    geistRegular,
    geistMedium,
    geistBold,
    monoMedium,
    logoSrc: `data:image/jpeg;base64,${logo.toString("base64")}`,
  };
}

export async function GET(req: NextRequest) {
  try {
    assetCache ??= loadAssets();
    const { geistRegular, geistMedium, geistBold, monoMedium, logoSrc } =
      await assetCache;

    const { searchParams } = new URL(req.url);

    const title = param(searchParams, "title", siteConfig.role, 90);
    const description = param(
      searchParams,
      "description",
      siteConfig.description,
      // Two full lines at 26px inside the 880px column.
      155,
    );
    const path = param(searchParams, "path", "home", 60);
    const tags = (searchParams.get("tags")?.split(",").filter(Boolean) ?? [])
      .slice(0, 4)
      .map((t) => truncate(decodeURIComponent(t.trim()), 20));

    return new ImageResponse(
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 72px",
          fontFamily: "Geist",
          position: "relative",
          overflow: "hidden",
          backgroundColor: C.bg,
        }}
      >
        {/* Warm brand glow bleeding in from the top-right corner */}
        <div
          style={{
            position: "absolute",
            top: "-320px",
            right: "-220px",
            width: "760px",
            height: "760px",
            display: "flex",
            borderRadius: "9999px",
            backgroundImage:
              "radial-gradient(circle, rgba(252,211,77,0.16) 0%, rgba(252,211,77,0.05) 45%, rgba(16,14,14,0) 70%)",
          }}
        />
        {/* Cool counterweight so the lower-left corner isn't dead space */}
        <div
          style={{
            position: "absolute",
            bottom: "-360px",
            left: "-260px",
            width: "800px",
            height: "800px",
            display: "flex",
            borderRadius: "9999px",
            backgroundImage:
              "radial-gradient(circle, rgba(96,165,250,0.10) 0%, rgba(16,14,14,0) 68%)",
          }}
        />

        {/* The site's dashed rails, redrawn at OG scale */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "40px",
            display: "flex",
            borderLeft: `1px dashed ${C.line}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: "40px",
            display: "flex",
            borderLeft: `1px dashed ${C.line}`,
          }}
        />

        {/* Top: terminal-style breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            zIndex: 1,
            fontFamily: "Geist Mono",
            fontSize: "18px",
          }}
        >
          <span style={{ color: C.text, letterSpacing: "0.01em" }}>
            {siteConfig.baseUrl.replace("https://", "")}
          </span>
          <span style={{ color: C.muted }}>/</span>
          <span style={{ color: C.secondary, letterSpacing: "0.03em" }}>
            {path}
          </span>
          <span
            style={{
              display: "flex",
              width: "10px",
              height: "20px",
              marginLeft: "2px",
              backgroundColor: C.brand,
            }}
          />
        </div>

        {/* Middle: title + description */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            zIndex: 1,
            maxWidth: "980px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: `${titleSize(title)}px`,
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: "-0.03em",
              color: C.text,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "26px",
              lineHeight: 1.42,
              color: C.secondary,
              maxWidth: "880px",
            }}
          >
            {description}
          </div>
        </div>

        {/* Bottom: identity on the left, tags on the right */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt=""
              width={68}
              height={68}
              style={{
                borderRadius: "9999px",
                border: `1px solid ${C.line}`,
              }}
            />
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <span
                style={{
                  fontSize: "26px",
                  fontWeight: 500,
                  color: C.text,
                  letterSpacing: "-0.01em",
                }}
              >
                {siteConfig.name}
              </span>
              <span
                style={{
                  fontSize: "19px",
                  fontFamily: "Geist Mono",
                  color: C.muted,
                }}
              >
                @{siteConfig.handle}
              </span>
            </div>
          </div>

          {tags.length > 0 && (
            <div style={{ display: "flex", gap: "10px" }}>
              {tags.map((tag) => (
                <div
                  key={tag}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "9px 18px",
                    borderRadius: "9999px",
                    border: `1px solid ${C.pillBorder}`,
                    backgroundColor: C.pillBg,
                    fontSize: "18px",
                    fontFamily: "Geist Mono",
                    color: C.secondary,
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [
          { name: "Geist", data: geistRegular, weight: 400, style: "normal" },
          { name: "Geist", data: geistMedium, weight: 500, style: "normal" },
          { name: "Geist", data: geistBold, weight: 700, style: "normal" },
          {
            name: "Geist Mono",
            data: monoMedium,
            weight: 500,
            style: "normal",
          },
        ],
        headers: {
          // Crawlers refetch often; let the CDN answer instead of re-rendering.
          "Cache-Control":
            "public, immutable, no-transform, max-age=31536000, s-maxage=31536000",
        },
      },
    );
  } catch (err) {
    console.error("[og] failed to render:", err);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
