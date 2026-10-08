/* First make sure that you have installed the package */

/* If you are using yarn */
// yarn add @calcom/embed-react

/* If you are using npm */
// npm install @calcom/embed-react
"use client";

import { useEffect } from "react";

import Image from "next/image";

import { getCalApi } from "@calcom/embed-react";

import { integrationConfig, siteConfig } from "@/lib/site";

export default function Calbutton() {
  useEffect(() => {
    if (integrationConfig.bookingUrl || !integrationConfig.calLink) return;
    (async function () {
      const cal = await getCalApi({ namespace: "connect" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);
  const className =
    "btn-chunky group flex cursor-pointer items-center rounded-lg border py-1 ps-4.5 pe-5 text-sm font-semibold";
  const content = (
    <>
      <Image
        src={siteConfig.profileImage}
        alt={`${siteConfig.name} avatar`}
        width={100}
        height={100}
        className="mr-1 size-6 rounded-full object-cover pb-[3px]"
      />
      <div className="flex max-w-0 items-center gap-1.5 overflow-hidden whitespace-nowrap opacity-0 transition-[max-width,margin,opacity] duration-200 ease-out group-hover:mr-2 group-hover:max-w-[120px] group-hover:opacity-100">
        <span className="pl-1.5 text-xs">+</span>
        <span className="bg-content-secondary text-content-inverted rounded-full p-1 text-xs">
          You
        </span>
      </div>
      Book a call
    </>
  );

  if (integrationConfig.bookingUrl) {
    return (
      <a
        href={integrationConfig.bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  if (!integrationConfig.calLink) {
    return (
      <a href={`mailto:${siteConfig.email}`} className={className}>
        {content}
      </a>
    );
  }

  return (
    <button
      data-cal-namespace="connect"
      data-cal-link={integrationConfig.calLink}
      className={className}
      data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
    >
      {content}
    </button>
  );
}
