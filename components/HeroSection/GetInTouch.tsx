"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { Check, Copy, FileText, Send } from "lucide-react";
import posthog from "posthog-js";

import { siteConfig } from "@/lib/site";

const GetInTouch = () => {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  useEffect(() => {
    if (copyStatus !== "copied") return;
    const timeout = setTimeout(() => setCopyStatus("idle"), 2500);
    return () => clearTimeout(timeout);
  }, [copyStatus]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  };

  return (
    <div className="mt-6 flex flex-wrap gap-3">
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
      <button
        type="button"
        onClick={copyEmail}
        className="btn-chunky border-line-strong text-content flex cursor-pointer items-center gap-2 rounded-md border py-1.5 ps-2.5 pe-3 text-sm"
        aria-label={
          copyStatus === "copied" ? "Email copied" : "Copy email address"
        }
      >
        {copyStatus === "copied" ? (
          <Check size={16} aria-hidden="true" />
        ) : (
          <Copy size={16} aria-hidden="true" />
        )}
        {copyStatus === "copied" ? "Copied!" : "Copy email"}
      </button>
      <span
        className={
          copyStatus === "error"
            ? "text-content-muted w-full text-xs"
            : "sr-only"
        }
        role="status"
      >
        {copyStatus === "copied" && "Email address copied to clipboard."}
        {copyStatus === "error" && (
          <>
            Couldn’t copy. Select this address:{" "}
            <span className="select-all">{siteConfig.email}</span>
          </>
        )}
      </span>
    </div>
  );
};

export default GetInTouch;
