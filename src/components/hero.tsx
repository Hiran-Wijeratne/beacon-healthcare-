"use client";

import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";

const trustBadge = "SRFAC-Accredited • SSG-Approved Training Provider";

export default function Hero() {
  const { ref, visible } = useRevealOnScroll<HTMLDivElement>();

  const riseStyle = (delayMs: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transitionDelay: `${delayMs}ms`,
  });

  return (
    <section
      ref={ref}
      className="relative mx-auto max-w-3xl overflow-hidden px-6 pt-12 pb-20 text-center sm:pt-16 sm:pb-24"
    >
      <img
        src="/images/manikin.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 select-none opacity-90 sm:max-w-2xl"
      />

      <div className="relative z-10">
        <p
          className="mx-auto mb-6 inline-flex items-center rounded-full border border-line bg-white/60 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-ink transition-all duration-700 ease-out"
          style={riseStyle(100)}
        >
          {trustBadge}
        </p>

        <h1
          className="text-4xl font-medium leading-[1.05] tracking-tight text-ink transition-all duration-700 ease-out sm:text-6xl lg:text-7xl"
          style={riseStyle(250)}
        >
          Learn First Aid. Make a Difference.
        </h1>

        <p
          className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-muted transition-all duration-700 ease-out sm:text-xl"
          style={riseStyle(400)}
        >
          Accredited first aid training designed for individuals, workplaces
          and corporate teams across Singapore.
        </p>

        <div
          className="mt-10 flex flex-col items-center justify-center gap-4 transition-all duration-700 ease-out sm:flex-row"
          style={riseStyle(600)}
        >
          <a
            href="#contact"
            className="rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-paper transition-opacity hover:opacity-90 sm:text-base"
          >
            Register for Courses
          </a>
          <a
            href="#courses"
            className="rounded-full border border-line bg-white/70 px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-white sm:text-base"
          >
            View All Courses
          </a>
        </div>
      </div>
    </section>
  );
}
