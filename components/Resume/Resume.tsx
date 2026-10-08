import PageHeader from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site";

import { Mark } from "./Mark";
import { PdfViewer } from "./PdfViewer";

export const Resume = () => {
  return (
    <section className="mx-auto flex w-full max-w-220 flex-col px-6">
      <PageHeader title="Resume">
        Naresh Tiwari. <Mark>Software Developer</Mark>.
      </PageHeader>

      <Reveal immediate delay={0.2}>
        {siteConfig.resumePath ? (
          <PdfViewer
            file={siteConfig.resumePath}
            filename="Naresh_Tiwari_Resume.pdf"
          />
        ) : (
          <div className="border-content-subtle/20 flex flex-col overflow-hidden rounded-lg border">
            <div className="border-content-subtle/15 bg-surface-raised flex items-center gap-2 border-b px-4 py-2.5">
              <span className="text-content-subtle min-w-0 flex-1 truncate font-mono text-[11px]">
                Résumé
              </span>
            </div>
            <div
              className="bg-content-subtle/5 relative flex-1 overflow-auto"
              style={{ minHeight: "80vh" }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-content-subtle font-mono text-xs">
                  Résumé coming soon.
                </span>
              </div>
            </div>
          </div>
        )}
      </Reveal>

      <div className="pb-10 sm:pb-14" />
    </section>
  );
};

export default Resume;
