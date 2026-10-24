import Image from "next/image";

import { Stagger } from "@/components/ui/Reveal";
import { introduction, mainSkills } from "@/lib/personal-content";
import { siteConfig } from "@/lib/site";

const AboutMe = () => {
  return (
    <section className="mx-auto mt-15 max-w-3xl pt-2 pb-10 md:px-0">
      <Stagger>
        <div className="px-8">
          <h2 className="text-content-muted mb-2 text-sm font-semibold">
            About
          </h2>
          <h2 className="mb-2 text-3xl font-bold">Me</h2>
        </div>
        <div className="flex flex-col items-center gap-8 rounded-2xl p-6 md:flex-row md:items-start">
          <div className="shrink-0">
            <div className="bg-brand flex h-55 w-55 items-center justify-center overflow-hidden rounded-2xl">
              <Image
                src={siteConfig.profileImage}
                alt={`${siteConfig.name} profile image`}
                width={220}
                height={220}
                className="h-full w-full object-contain"
                unoptimized
              />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="mb-2 text-3xl font-bold md:text-4xl">
              {siteConfig.name}
            </h2>
            <p className="mb-4 text-base">
              {introduction.map((part, index) =>
                part.icon || part.emphasized ? (
                  <strong key={index}>{part.text}</strong>
                ) : (
                  part.text
                ),
              )}
            </p>
            <div className="border-line mb-4 border-l-2 pl-3">
              <h3 className="mb-1 text-sm font-semibold">Education</h3>
              <p className="text-content-secondary text-sm">
                B.Tech in Computer Science and Engineering
              </p>
              <p className="text-content-muted mt-1 text-sm">
                Lovely Professional University, Phagwara
              </p>
              <p className="text-content-subtle mt-1 text-xs">2022–2026</p>
            </div>
            <div>
              <span className="text-sm font-semibold">Skills</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {mainSkills.map((skill) => (
                  <Image
                    key={skill.name}
                    src={skill.icon}
                    alt={skill.name}
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded p-1"
                    unoptimized
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Stagger>

      <div className="h-10" />
    </section>
  );
};

export default AboutMe;
