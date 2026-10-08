import Image from "next/image";

import { siteConfig } from "@/lib/site";

const SOURCE = { width: 2400, height: 1350 };
const CARD = { x: 688, y: 338, width: 1026, height: 674 };

/** Frame the supplied card without modifying the PNG's original pixels. */
const XProfilePreview = () => (
  <div className="border-line-strong/90 w-fit overflow-hidden rounded-3xl border-2">
    <div
      className="relative w-[300px] overflow-hidden"
      style={{ aspectRatio: `${CARD.width} / ${CARD.height}` }}
    >
      <Image
        src="/social-x.png"
        alt={`${siteConfig.name} X profile card`}
        width={720}
        height={405}
        loading="eager"
        className="absolute max-w-none"
        style={{
          width: `${(SOURCE.width / CARD.width) * 100}%`,
          height: "auto",
          left: `${-(CARD.x / CARD.width) * 100}%`,
          top: `${-(CARD.y / CARD.height) * 100}%`,
        }}
      />
    </div>
  </div>
);

export default XProfilePreview;
