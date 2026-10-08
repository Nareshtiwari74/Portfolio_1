import { Stagger } from "@/components/ui/Reveal";

import AchievmentCard from "./AchievmentCard";

const Achievments = () => {
  return (
    <section className="mx-auto mt-15 w-full max-w-200 px-8 md:px-0">
      <Stagger>
        <h2 className="text-content-muted mb-2 text-sm font-semibold">
          Achievements
        </h2>
        <h2 className="mb-2 text-3xl font-bold">Achievements</h2>
        <AchievmentCard />
      </Stagger>

      <div className="h-10" />
    </section>
  );
};

export default Achievments;
