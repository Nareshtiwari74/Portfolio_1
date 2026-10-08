import Image from "next/image";
import Link from "next/link";

import { CodeXml, Github, Instagram, Mail } from "lucide-react";

import HoverTooltip from "@/components/ui/HoverTooltip";
import { siteConfig } from "@/lib/site";

import Calbutton from "./Calbutton";
import { VisitorCounter } from "./VisitorCounter";

const mailto = `mailto:${siteConfig.email}`;

const contactLinks = [
  { href: siteConfig.github, label: "GitHub", Icon: Github },
  {
    href: siteConfig.leetcode,
    label: "LeetCode",
    Icon: CodeXml,
  },
  { href: siteConfig.instagram, label: "Instagram", Icon: Instagram },
  { href: mailto, label: "Email", Icon: Mail },
];

const friends = [
  { name: "GitHub", url: siteConfig.github, image: "/social-github.svg" },
  { name: "LeetCode", url: siteConfig.leetcode, image: "/social-leetcode.svg" },
  { name: "X", url: siteConfig.x, image: "/social-x.svg" },
  {
    name: "Instagram",
    url: siteConfig.instagram,
    image: siteConfig.profileImage,
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
          <div className="flex gap-3">
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

      <div className="pt-8 text-center">
        <div className="mt-2 flex justify-between">
          <div>
            <p className="text-content-muted text-[10px]">find me online</p>
            <div className="mt-1 flex gap-2">
              {friends.map((friend) => (
                <div key={friend.name} className="group relative">
                  <Link
                    href={friend.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block size-7 overflow-hidden rounded-[5px]"
                  >
                    <Image
                      src={friend.image}
                      alt={friend.name}
                      width={28}
                      height={28}
                      unoptimized
                      className="outline-image-outline h-full w-full rounded-[5px] object-contain opacity-80 outline -outline-offset-1 transition-opacity duration-150 ease-out group-hover:opacity-100"
                    />
                  </Link>

                  <HoverTooltip className="-top-9 px-2 py-1 text-[10px] font-medium capitalize">
                    {friend.name}
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
