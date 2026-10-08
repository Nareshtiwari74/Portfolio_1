import Image from "next/image";

import { introduction } from "@/lib/personal-content";
import { siteConfig } from "@/lib/site";

import ScribbleUnderline from "./ScribbleUnderline";

const Intro = () => {
  return (
    <div>
      <h1 className="pt-8 text-3xl leading-[1.15] font-bold tracking-tight sm:text-4xl md:text-5xl">
        <span className="text-content block">
          I&apos;m{" "}
          <span className="relative inline-block">
            {siteConfig.name.split(" ")[0]}
            <ScribbleUnderline />
          </span>
        </span>
        <span className="text-content-subtle block max-w-full">
          A {siteConfig.role}.
        </span>
      </h1>

      <p className="text-content-subtle space-y-6 px-1 py-2 pt-5 text-lg leading-8 sm:leading-relaxed">
        {introduction.map((part, index) =>
          part.icon ? (
            <span
              key={index}
              className={
                part.text === "REST APIs"
                  ? "chip mx-1 my-1 inline-flex items-center gap-1 rounded-md py-1 pr-2 pl-1 text-sm font-bold"
                  : "chip mx-1 my-1 inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-bold"
              }
            >
              <Image
                src={part.icon}
                alt=""
                width={16}
                height={16}
                className="h-4 w-4"
                unoptimized
              />
              {part.text}
            </span>
          ) : part.emphasized ? (
            <strong key={index}>{part.text}</strong>
          ) : (
            part.text
          ),
        )}
      </p>
    </div>
  );
};

export default Intro;
