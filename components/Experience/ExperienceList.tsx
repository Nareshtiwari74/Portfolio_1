"use client";

import { useState } from "react";

import { roles } from "./experienceData";
import ExperienceRow from "./ExperienceRow";

/** Accordion of career rows; at most one is open at a time. */
const ExperienceList = () => {
  const [openId, setOpenId] = useState<string | null>(null);

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
          isOpen={openId === item.id}
          onToggle={() => setOpenId(openId === item.id ? null : item.id)}
        />
      ))}
    </div>
  );
};

export default ExperienceList;
