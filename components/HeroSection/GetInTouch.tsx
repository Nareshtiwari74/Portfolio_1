"use client";

import Link from "next/link";

import { FileText, Send } from "lucide-react";
import posthog from "posthog-js";

import { siteConfig } from "@/lib/site";

const GetInTouch = () => {
  return (
    <div className="mt-6 flex gap-4">
      <Link
        href="/resume"
        className="btn-chunky-primary border-line-inverted flex items-center gap-2 rounded-md border py-1.5 ps-2.5 pe-3 text-sm"
      >
        <FileText size={16} /> Resume / CV
      </Link>
      <Link
        href={`mailto:${siteConfig.email}`}
        onClick={() => posthog.capture("contact_clicked", { method: "email" })}
        className="btn-chunky border-line-strong text-content flex items-center gap-2 rounded-md border py-1.5 ps-2.5 pe-3 text-sm"
      >
        <Send size={16} /> Get in touch
      </Link>
    </div>
  );
};

export default GetInTouch;
