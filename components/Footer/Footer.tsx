import Image from "next/image";
import Link from "next/link";

import { CodeXml, Github, Instagram, Linkedin, Mail } from "lucide-react";

import SongActivity from "@/components/HeroSection/SongActivity";
import HoverTooltip from "@/components/ui/HoverTooltip";
import { siteConfig } from "@/lib/site";

import Calbutton from "./Calbutton";
import { VisitorCounter } from "./VisitorCounter";

const mailto = `mailto:${siteConfig.email}`;

const contactLinks = [
  { href: siteConfig.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: siteConfig.github, label: "GitHub", Icon: Github },
  {
    href: siteConfig.leetcode,
    label: "LeetCode",
    Icon: CodeXml,
  },
  { href: siteConfig.instagram, label: "Instagram", Icon: Instagram },
  { href: mailto, label: "Email", Icon: Mail },
];

const onlineProfiles = [
  {
    name: "LinkedIn",
    url: siteConfig.linkedin,
    logo: <Linkedin size={20} aria-hidden="true" />,
  },
  {
    name: "GitHub",
    url: siteConfig.github,
    logo: (
      <Image
        src="/github-logo.png"
        alt=""
        width={20}
        height={20}
        className="size-5 object-contain dark:invert"
      />
    ),
  },
  {
    name: "LeetCode",
    url: siteConfig.leetcode,
    logo: (
      <Image
        src="/leetcode-logo.svg"
        alt=""
        width={20}
        height={20}
        className="size-5 rounded-sm bg-white object-contain p-0.5"
      />
    ),
  },
  {
    name: "X",
    url: siteConfig.x,
    logo: (
      <Image
        src="/x-logo.jpg"
        alt=""
        width={20}
        height={20}
        className="size-5 rounded-sm object-contain"
      />
    ),
  },
  {
    name: "Instagram",
    url: siteConfig.instagram,
    logo: (
      <Image
        src="/instagram-logo.png"
        alt=""
        width={20}
        height={20}
        className="size-5 object-contain"
      />
    ),
  },
];

const Footer = () => {
  return (
    <footer className="mt-15 space-y-8 pb-24">
      <div className="flex flex-col items-center">
        {/* cal.com connect button  */}
        <Calbutton />
        <div className="flex w-full flex-col items-center justify-between gap-8 md:flex-row">
          <div className="text-center md:text-left">
            <p className="mb-2 bg-linear-to-r bg-clip-text text-2xl font-bold text-transparent">
              Let&apos;s build something amazing.
            </p>
            <p className="mb-3 text-sm">
              Contact me about projects and collaborations
            </p>
            <a
              href={mailto}
              className="group inline-flex items-center gap-2 text-sm transition-colors"
            >
              <Mail
                size={16}
                className="transition-transform duration-150 ease-out group-hover:scale-105"
              />
              {siteConfig.email}
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {contactLinks.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="btn-chunky rounded-xl border p-3"
              >
                <Icon size={22} />
              </a>
            ))}
          </div>
        </div>

        <div className="h-10 w-full" />
      </div>

      <details className="border-line mx-auto w-full max-w-md rounded-xl border px-4 py-3">
        <summary className="text-content-muted hover:text-content cursor-pointer text-sm font-medium">
          A little personal · On my playlist
        </summary>
        <div className="mt-3">
          <SongActivity />
        </div>
      </details>

      <div className="pt-8 text-center">
        <div className="mt-2 flex justify-between">
          <div>
            <p className="text-content-muted text-[10px]">find me online</p>
            <div className="mt-1 flex gap-2">
              {onlineProfiles.map((profile) => (
                <div key={profile.name} className="group relative">
                  <Link
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={profile.name}
                    className="text-content-secondary hover:text-content focus-visible:text-content flex size-7 items-center justify-center rounded-[5px] opacity-80 transition-opacity duration-150 ease-out hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    {profile.logo}
                  </Link>

                  <HoverTooltip className="-top-9 px-2 py-1 text-[10px] font-medium group-focus-within:opacity-100">
                    {profile.name}
                  </HoverTooltip>
                </div>
              ))}
            </div>
          </div>
          <VisitorCounter />
        </div>
        <p className="pt-10 text-xs">© 2026 {siteConfig.name}.</p>
      </div>
    </footer>
  );
};

export default Footer;
