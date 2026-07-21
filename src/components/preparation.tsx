"use client";

import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";

export default function Preparation() {
  const { ref, visible } = useRevealOnScroll<HTMLDivElement>();

  const riseStyle = (delayMs: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transitionDelay: `${delayMs}ms`,
  });

  return (
    <section className="relative overflow-hidden bg-white">
      <div
        ref={ref}
        className="relative h-[80vh] min-h-[520px] w-full sm:min-h-[640px]"
      >
        <img
          src="/images/last image.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover transition-all duration-[800ms] ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
          }}
        />

        <div className="relative z-10 mx-auto flex h-full max-w-[1280px] items-center px-6">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest text-white/70 transition-all duration-[400ms] ease-out"
              style={riseStyle(0)}
            >
              Preparation
            </p>
            <h2
              className="mt-6 max-w-[520px] text-3xl font-medium leading-[1.25] tracking-tight text-white transition-all duration-[400ms] ease-out sm:text-[40px]"
              style={riseStyle(150)}
            >
              Preparation begins
              <br />
              long before
              <br />
              an emergency.
            </h2>
            <p
              className="mt-8 max-w-[420px] text-lg leading-relaxed text-white/70 transition-all duration-[400ms] ease-out"
              style={riseStyle(300)}
            >
              The confidence to act tomorrow begins with the decisions you
              make today.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
