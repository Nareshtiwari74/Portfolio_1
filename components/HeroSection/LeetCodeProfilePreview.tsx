import Image from "next/image";

import { siteConfig } from "@/lib/site";

/** Naresh's supplied LeetCode profile screenshot. */
const LeetCodeProfilePreview = () => (
  <div className="border-line-strong/90 w-fit overflow-hidden rounded-3xl border-2">
    <Image
      src="/social-leetcode.png"
      alt={`${siteConfig.name} LeetCode profile card`}
      width={616}
      height={232}
      sizes="300px"
      loading="eager"
      className="h-auto w-[300px]"
    />
  </div>
);

export default LeetCodeProfilePreview;
