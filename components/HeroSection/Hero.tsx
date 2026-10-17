import Image from "next/image";

import DashedRule from "@/components/ui/DashedRule";
import { Reveal, Stagger } from "@/components/ui/Reveal";
import { todayTime } from "@/lib/wakatime/wakatime-service";

import ProfileAvatar from "./avatar-standard-4";
import GetInTouch from "./GetInTouch";
import Intro from "./Intro";
import PersonalInfo from "./PersonalInfo";
import SocialLinks from "./SocialLinks";

const Hero = async () => {
  // Fetched here rather than in the client badge so the WakaTime key stays on
  // the server; `ProfileAvatar` only forwards the value down.
  const codeTime = await todayTime();

  return (
    <section className="mx-auto w-full max-w-200 px-8 md:px-0">
      <Reveal
        immediate
        className="border-content/10 bg-surface-raised shadow-float relative mt-12 mb-8 h-72 w-full overflow-hidden rounded-[2rem] border sm:h-80"
      >
        <Image
          src="/light_hero.gif"
          alt="Light hero background"
          fill
          unoptimized
          className="object-cover opacity-90"
          priority
          sizes="(max-width: 768px) 100vw, 720px"
        />

        <div className="from-on-media/1 to-overlay/25 absolute inset-0 bg-linear-to-b via-transparent" />
        <div className="from-background via-background/70 absolute inset-x-0 bottom-0 h-28 bg-linear-to-t to-transparent sm:h-32" />
      </Reveal>

      {/* Above the fold, so this runs on mount rather than on scroll. */}
      <Stagger immediate delay={0.15}>
        <div className="relative z-10 -mt-26 sm:-mt-30">
          <ProfileAvatar codeTime={codeTime} />
        </div>

        <Intro />

        <GetInTouch />

        <SocialLinks />
      </Stagger>

      <div className="mt-6">
        <DashedRule position="flow" />
      </div>

      <Reveal immediate delay={0.55}>
        <PersonalInfo />
      </Reveal>

      <div className="h-10"></div>
    </section>
  );
};

export default Hero;
