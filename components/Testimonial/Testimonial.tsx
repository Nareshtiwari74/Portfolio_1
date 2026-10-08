"use client";

import { Stagger } from "@/components/ui/Reveal";

const Testimonial = () => {
  return (
    <section className="mx-auto mt-15 w-full max-w-200 px-8 md:px-0">
      <Stagger>
        <h2 className="text-content-muted mb-2 text-sm font-semibold">
          Social Proof
        </h2>
        <h2 className="mb-6 text-3xl font-bold">Featured On</h2>

        <div className="group border-line relative overflow-hidden rounded-2xl border">
          <div className="relative pb-[56.25%]">
            <div className="bg-content/1 absolute inset-0 flex items-center justify-center">
              <p className="text-content-muted text-sm">
                Features and testimonials coming soon.
              </p>
            </div>
          </div>
        </div>
      </Stagger>

      <div className="h-10" />
    </section>
  );
};

export default Testimonial;
