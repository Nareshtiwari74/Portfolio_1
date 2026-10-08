import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/array/:path*",
        destination: "https://us-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  // Required to support PostHog trailing-slash API requests
  skipTrailingSlashRedirect: true,
  allowedDevOrigins: ["192.168.0.158"],
  // The OG route reads its fonts and avatar off disk at request time, so file
  // tracing can't see them from the import graph — include them explicitly or
  // the deployed function 500s on a missing file.
  outputFileTracingIncludes: {
    "/og": ["./app/og/fonts/**", "./app/og/assets/**"],
  },
  images: {
    qualities: [50, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
      },
      {
        protocol: "https",
        hostname: "www.vectorlogo.zone",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "skillicons.dev",
      },
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.softr-files.com",
      },
      {
        protocol: "https",
        hostname: "www.gurudes.tech",
      },
      {
        protocol: "https",
        hostname: "media.geeksforgeeks.org",
      },
      {
        protocol: "https",
        hostname: "accountgram-production.sfo2.cdn.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn2.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "miro.medium.com",
      },
      {
        protocol: "https",
        hostname: "xevrion.dev",
      },
      {
        protocol: "https",
        hostname: "www.nikhilverse.pro",
      },
    ],
  },
};

export default nextConfig;
