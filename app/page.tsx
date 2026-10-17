import { Suspense } from "react";

import { Metadata } from "next";
import dynamic from "next/dynamic";

import AboutMe from "@/components/AboutMe/AboutMe";
import Experience from "@/components/Experience/Experience";
import GitHub from "@/components/GitHub/GitHub";
import PrActivity from "@/components/GitHub/PrActivity";
import Hero from "@/components/HeroSection/Hero";
import TechStack from "@/components/HeroSection/TechStack";
import Projects from "@/components/Projects/Projects";
import { JsonLd } from "@/components/seo/JsonLd";
import DashedRule from "@/components/ui/DashedRule";
import FadeIn from "@/components/ui/FadeIn";
import { Reveal } from "@/components/ui/Reveal";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
import { ogImage, ogImageUrl } from "@/lib/og";
import { techStack } from "@/lib/personal-content";
import { siteConfig } from "@/lib/site";

const Achievments = dynamic(
  () => import("@/components/Achievments/Achievments"),
);
const Comments = dynamic(() => import("@/components/Comments/Comments"));

const title = `${siteConfig.name} | ${siteConfig.role} Portfolio`;
const description = siteConfig.description;

// The name already sits in the card's footer, so the headline carries the craft.
const og = {
  title: siteConfig.role,
  description,
  path: "home",
  tags: ["java", "spring boot", "rest apis", "sql", "react"],
} as const;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    siteConfig.name,
    siteConfig.role,
    ...techStack.map((tech) => tech.name),
    "Portfolio",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  metadataBase: new URL(siteConfig.baseUrl),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.baseUrl,
    title,
    description,
    siteName: `${siteConfig.name} Portfolio`,
    images: [ogImage(og)],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImageUrl(og)],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/** A home page section plus the dashed rule that closes it off. */
const Band = ({
  children,
  rule = "top",
}: {
  children: React.ReactNode;
  rule?: React.ComponentProps<typeof DashedRule>["position"];
}) => (
  <div className="relative">
    {children}
    <DashedRule position={rule} />
  </div>
);

const HomePage = () => (
  <div className="md:px-0">
    {/* The two entities the rest of the site's structured data refers back to
        by `@id`: who this is, and what the site is. */}
    <JsonLd type="person" />
    <JsonLd type="website" />

    {/* Hero reveals its own children in sequence, so it is deliberately not
        wrapped in a single block-level FadeIn. */}
    <div className="relative">
      <Hero />
      <DashedRule position="bottom" />
    </div>

    <Band rule="bottom">
      <Reveal>
        <TechStack />
      </Reveal>
    </Band>

    <Band>
      <Experience />
    </Band>

    <Band>
      <Projects />
    </Band>

    <Band rule="bottom-1">
      <AboutMe />
    </Band>

    <Suspense
      fallback={<SectionSkeleton className="mx-auto max-w-200 px-8 md:px-0" />}
    >
      <GitHub />
    </Suspense>

    <Band>
      <FadeIn>
        <PrActivity />
      </FadeIn>
    </Band>

    <Band>
      <Suspense fallback={<SectionSkeleton />}>
        <Achievments />
      </Suspense>
    </Band>

    <Band>
      <FadeIn>
        <Suspense fallback={<SectionSkeleton />}>
          <Comments />
        </Suspense>
      </FadeIn>
    </Band>
  </div>
);

export default HomePage;
