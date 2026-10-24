import { ArrowDown, Check, Layers3 } from "lucide-react";

import type { ProjectType } from "./projectsData";

export default function ProjectCaseStudy({
  details,
}: {
  details: NonNullable<ProjectType["caseStudy"]>;
}) {
  return (
    <div className="mb-6 space-y-6">
      {details.decisions && details.decisions.length > 0 && (
        <section aria-label="Engineering decisions">
          <h3 className="text-content mb-3 text-sm font-semibold">
            Engineering decisions
          </h3>
          <div className="space-y-3">
            {details.decisions.map((decision) => (
              <div
                key={decision.title}
                className="border-line rounded-xl border p-4"
              >
                <h4 className="text-content text-sm font-medium">
                  {decision.title}
                </h4>
                <p className="text-content-muted mt-2 text-xs leading-relaxed">
                  {decision.detail}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
      <section
        aria-label="Project highlights"
        className="grid gap-3 sm:grid-cols-2"
      >
        {details.highlights.map((highlight, index) => (
          <div
            key={highlight.title}
            className="border-line bg-surface-raised rounded-xl border p-4"
          >
            <span className="text-content-subtle font-mono text-xs">
              0{index + 1}
            </span>
            <h3 className="text-content mt-2 text-sm font-semibold">
              {highlight.title}
            </h3>
            <p className="text-content-muted mt-1 text-xs leading-relaxed">
              {highlight.detail}
            </p>
          </div>
        ))}
      </section>

      <section>
        <h3 className="text-content mb-3 flex items-center gap-2 text-sm font-semibold">
          <Layers3 size={16} aria-hidden="true" /> One upload, behind the scenes
        </h3>
        <ol className="border-line divide-line divide-y rounded-xl border px-4">
          {details.flow.map((step, index) => (
            <li key={step.title} className="flex items-center gap-3 py-3">
              <span className="bg-surface-strong text-content-muted grid size-7 shrink-0 place-items-center rounded-lg font-mono text-xs">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-content text-sm font-medium">{step.title}</p>
                <p className="text-content-muted text-xs">{step.detail}</p>
              </div>
              {index < details.flow.length - 1 && (
                <ArrowDown
                  size={14}
                  className="text-content-subtle"
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ol>
        <p className="text-content-subtle mt-2 text-xs leading-relaxed">
          File bytes and metadata are stored separately, linked by a storage
          key.
        </p>
      </section>

      <section className="border-line rounded-xl border p-4">
        <h3 className="text-content flex items-center gap-2 text-sm font-semibold">
          <Check size={15} aria-hidden="true" /> Live today
        </h3>
        <p className="text-content-muted mt-2 text-xs leading-relaxed">
          {details.deployment}
        </p>
        <div className="border-line mt-3 border-t pt-3">
          <h4 className="text-content-secondary text-xs font-semibold">
            Next on the roadmap
          </h4>
          <p className="text-content-muted mt-1 text-xs leading-relaxed">
            {details.roadmap}
          </p>
        </div>
      </section>
      <p className="border-line bg-surface-raised text-content-secondary rounded-xl border border-dashed p-4 text-xs leading-relaxed">
        {details.demoNote}
      </p>
    </div>
  );
}
