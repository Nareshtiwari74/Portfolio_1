"use client";

import { useState } from "react";

import { roles } from "./experienceData";
import ExperienceRow from "./ExperienceRow";

/** Career rows that can be expanded and collapsed independently. */
const ExperienceList = () => {
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());

  const toggleExperience = (id: string) => {
    setOpenIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="border-line bg-surface-subtle divide-line divide-y overflow-hidden rounded-2xl border">
      {roles.length === 0 && (
        <div className="px-5 py-5 sm:px-6">
          <p className="text-content-muted text-sm">
            Experience details coming soon.
          </p>
          <p className="text-content-muted mt-0.5 text-sm">
            Education details coming soon.
          </p>
        </div>
      )}
      {roles.map((item) => (
        <ExperienceRow
          key={item.id}
          item={item}
          isOpen={openIds.has(item.id)}
          onToggle={() => toggleExperience(item.id)}
        />
      ))}
    </div>
  );
};

export default ExperienceList;
