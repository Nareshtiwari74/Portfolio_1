import { Reveal } from "@/components/ui/Reveal";

import ExperienceList from "./ExperienceList";

const Experience = () => {
  return (
    <section id="work" className="mx-auto mt-15 w-full max-w-200 px-8 md:px-0">
      <Reveal className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-content-muted mb-1 text-sm">Career Path</p>
          <h2 className="text-content text-3xl font-bold">
            Experience & Impact
          </h2>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <ExperienceList />
      </Reveal>

      <div className="h-10" />
    </section>
  );
};

export default Experience;
