import { Suspense } from "react";

import type { Metadata, Viewport } from "next";
import { Caveat, Geist, Geist_Mono } from "next/font/google";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import Footer from "@/components/Footer/Footer";
import FooterBlur from "@/components/Footer/FooterBlur";
import MotionProvider from "@/components/MotionProvider";
import NavBar from "@/components/Navbar/NavBar";
import Quotes from "@/components/Quotes/Quotes";
import FadeIn from "@/components/ui/FadeIn";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
import { ThemeProvider } from "@/hooks/ThemeProvider";
import { ogImage, ogImageUrl } from "@/lib/og";
import { siteConfig } from "@/lib/site";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  // Fallback only — every route sets its own title.
  title: `${siteConfig.name} | ${siteConfig.role}`,
  description: siteConfig.description,
  openGraph: {
    images: [ogImage()],
  },
  twitter: {
    card: "summary_large_image",
    images: [ogImageUrl()],
  },
};

// viewportFit: "cover" lets the page paint into the safe areas so the content
// sits *behind* iOS Safari's floating bottom bar instead of being pushed above it.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const THEME_COLOR_DARK = "#100e0e";

// Script to prevent flash of incorrect theme
const themeInitScript = `
  (function() {
    try {
      const savedTheme = localStorage.getItem('theme');
      const isDark = savedTheme !== 'light';
      document.documentElement.classList.toggle('dark', isDark);
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ThemeProvider updates this after hydration so the initial attributes match. */}
        <meta name="theme-color" content={THEME_COLOR_DARK} />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link
          rel="preload"
          href={siteConfig.profileImage}
          as="image"
          type="image/jpeg"
        />
        <link
          rel="preload"
          href={siteConfig.easterEggImage}
          as="image"
          type="image/webp"
          fetchPriority="low"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} antialiased`}
      >
        <ThemeProvider>
          <MotionProvider>
            {/* Decorative outer dashed border*/}
            <div
              className="pointer-events-none fixed inset-y-0 z-[40] hidden overflow-hidden sm:block"
              style={{ left: "calc(50% - 340px)" }}
            >
              {/*<div
                className="border-overlay/70 absolute inset-0 h-full w-[60px] border opacity-[0.06] dark:opacity-[0.04]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(-45deg, transparent, transparent 2px, currentcolor 2px, currentcolor 3px, transparent 3px, transparent 6px)",
                }}
              />*/}
              <div className="border-line-strong z-99 h-full w-170 border-x border-dashed dark:border-[#272727]"></div>
            </div>

            <NavBar />
            <div className="md:[zoom:0.8]">{children}</div>
            <div className="relative md:[zoom:0.8]">
              <div className="border-line-strong absolute bottom-60 left-0 z-99 h-10 w-screen border border-dashed md:left-1/2 md:w-[125vw] md:-translate-x-1/2 dark:border-[#272727]" />

              <div className="border-line-strong absolute top-60 left-0 z-99 h-10 w-screen border border-dashed md:top-53 md:left-1/2 md:w-[125vw] md:-translate-x-1/2 dark:border-[#272727]" />

              <div className="mx-auto w-full max-w-200 px-8 md:px-0">
                <FadeIn>
                  <Suspense fallback={<SectionSkeleton />}>
                    <Quotes />
                    <Footer />
                  </Suspense>
                </FadeIn>
              </div>

              <div className="border-line-strong absolute bottom-1 left-0 z-99 h-10 w-screen border border-dashed md:left-1/2 md:w-[125vw] md:-translate-x-1/2 dark:border-[#272727]" />
            </div>
            <FooterBlur />
          </MotionProvider>
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED === "true" && (
          <Analytics />
        )}
        {process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED === "true" && (
          <SpeedInsights />
        )}
      </body>
    </html>
  );
}
