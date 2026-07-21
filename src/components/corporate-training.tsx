"use client";

import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";

const benefits = [
  "On-site Training Available",
  "Flexible Scheduling",
  "Group Bookings",
  "Customised Programmes",
];

export default function CorporateTraining() {
  const { ref: revealRef, visible } = useRevealOnScroll<HTMLDivElement>();

  return (
    <section id="corporate" className="relative overflow-hidden bg-white">
      <div
        ref={revealRef}
        className="relative pt-20 pb-40 transition-all duration-700 ease-out sm:pt-28 sm:pb-64"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
        }}
      >
        {/* Room backdrop, full width of the section */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          {/* ceiling, tapered with the same angle as the floor so both
              converge symmetrically toward the centre wall */}
          <div
            className="absolute inset-x-0 top-0 h-32 sm:h-48"
            style={{
              clipPath: "polygon(0% 0%, 100% 0%, 89% 100%, 11% 100%)",
              background: "linear-gradient(to bottom, #eeeeec, transparent)",
            }}
          />
          <div
            className="absolute left-1/2 top-10 h-1 w-1/3 max-w-xl -translate-x-1/2 rounded-full bg-white sm:top-14"
            style={{ boxShadow: "0 0 90px 34px rgba(255,255,255,0.95)" }}
          />

          {/* side walls, implied via perspective trapezoids */}
          <div
            className="absolute inset-y-0 left-0 w-[8%] bg-gradient-to-r from-[#e6e6e4] to-[#f6f6f5] sm:w-[12%]"
            style={{ clipPath: "polygon(0% 0%, 100% 14%, 100% 86%, 0% 100%)" }}
          />
          <div
            className="absolute inset-y-0 right-0 w-[8%] bg-gradient-to-l from-[#e6e6e4] to-[#f6f6f5] sm:w-[12%]"
            style={{ clipPath: "polygon(100% 0%, 0% 14%, 0% 86%, 100% 100%)" }}
          />

          {/* floor, tapered to match the converging side walls so the room
              reads as one continuous perspective rather than a flat strip */}
          <div
            className="absolute inset-x-0 bottom-0 h-[18%]"
            style={{
              clipPath: "polygon(11% 0%, 89% 0%, 100% 100%, 0% 100%)",
              background:
                "linear-gradient(to bottom, #e6e6e4 0%, #f2f2f0 55%, #ffffff 100%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-[18%] opacity-70"
            style={{
              clipPath: "polygon(11% 0%, 89% 0%, 100% 100%, 0% 100%)",
              background:
                "radial-gradient(60% 90% at 50% 0%, rgba(255,255,255,0.85), transparent 70%)",
            }}
          />
        </div>

        {/* audience, seated facing the wall — closest to the viewer on the
            z-axis, in front of the walls and floor */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 mx-auto h-36 w-full max-w-3xl overflow-hidden sm:h-56">
          <img
            src="/images/Expand Image with Matching Clouds.svg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-bottom"
          />
        </div>

        {/* content, on the centre wall */}
        <div className="relative z-30 mx-auto max-w-2xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-black/50">
            Corporate Training
          </p>
          <h2 className="mt-4 text-3xl font-medium tracking-tight text-black sm:text-[40px]">
            Helping organisations build
            <br className="hidden sm:block" /> safer, better-prepared teams.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-black/60">
            From healthcare providers to offices, schools, and businesses, we
            deliver practical first aid training tailored to your workplace,
            helping teams meet training requirements while developing
            confidence in emergency situations.
          </p>
        </div>

        <div className="relative z-30 mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center px-6 sm:flex-nowrap">
          {benefits.map((benefit, i) => (
            <div
              key={benefit}
              className={`flex items-center gap-2 px-6 py-2 text-sm text-black/70 ${
                i !== 0 ? "sm:border-l sm:border-[#E8E8E8]" : ""
              }`}
            >
              <span className="text-black">✓</span>
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        <div className="relative z-30 mt-14 flex justify-center px-6">
          <a
            href="#contact"
            className="rounded-full bg-black px-8 py-4 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:opacity-90"
          >
            Request Corporate Training
          </a>
        </div>
      </div>
    </section>
  );
}
