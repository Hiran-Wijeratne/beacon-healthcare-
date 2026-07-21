"use client";

import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";

const whyBeaconFeatures = [
  {
    title: "Practical Learning",
    description: "Train through realistic, hands-on emergency scenarios.",
  },
  {
    title: "Accredited Courses",
    description: "Nationally recognised certifications trusted by workplaces.",
  },
  {
    title: "Experienced Trainers",
    description: "Learn from certified instructors with real-world expertise.",
  },
  {
    title: "Small Class Experience",
    description: "Interactive sessions with personalised guidance.",
  },
];

const trustStats = [
  { value: "5,000+", label: "Learners Certified" },
  { value: "250+", label: "Corporate Clients" },
  { value: "4.9★", label: "Google Rating" },
  { value: "15+", label: "Certified Trainers" },
];

export default function WhyBeacon() {
  const header = useRevealOnScroll<HTMLDivElement>();
  const features = useRevealOnScroll<HTMLDivElement>();
  const stats = useRevealOnScroll<HTMLDivElement>();

  const riseStyle = (visible: boolean, delayMs = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(20px)",
    transitionDelay: `${delayMs}ms`,
  });

  return (
    <section id="why-beacon-content" className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-[1200px]">
        <div
          ref={header.ref}
          className="mx-auto max-w-2xl text-center transition-all duration-[800ms] ease-out"
          style={riseStyle(header.visible, 100)}
        >
          <p className="mx-auto inline-flex items-center rounded-full border border-line bg-white/60 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-ink">
            Why Beacon Healthcare
          </p>
          <h2 className="mt-6 text-3xl font-medium tracking-tight text-ink sm:text-[40px]">
            We prepare ordinary people for extraordinary moments.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
            Practical, accredited first aid training that builds the
            confidence to respond calmly when every second matters.
          </p>
        </div>

        <div
          ref={features.ref}
          className="mt-16 grid gap-10 transition-all duration-[800ms] ease-out sm:grid-cols-2 sm:gap-8 lg:grid-cols-4"
          style={riseStyle(features.visible, 100)}
        >
          {whyBeaconFeatures.map((feature) => (
            <div key={feature.title}>
              <h3 className="font-medium text-ink">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div
          ref={stats.ref}
          className="mt-16 grid gap-y-8 transition-all duration-[800ms] ease-out sm:grid-cols-2 sm:gap-8 lg:grid-cols-4"
          style={riseStyle(stats.visible, 100)}
        >
          {trustStats.map((stat) => (
            <div key={stat.label} className="flex items-baseline gap-2">
              <span className="text-3xl font-medium tracking-tight text-ink">
                {stat.value}
              </span>
              <span className="text-xs uppercase tracking-widest text-ink-muted">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
