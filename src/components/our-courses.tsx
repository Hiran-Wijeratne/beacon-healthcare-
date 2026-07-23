"use client";

import { useMemo, useState } from "react";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";

const courses = [
  {
    name: "BCLS + AED",
    description: "For healthcare professionals.",
    image:
      "https://images.unsplash.com/photo-1755550247429-1e4bce9dd031?q=80&w=1600&auto=format&fit=crop",
  },
  {
    name: "Standard First Aid",
    description: "For everyday emergencies.",
    image:
      "https://images.unsplash.com/photo-1609840534195-e6385ca0d10a?q=80&w=1600&auto=format&fit=crop",
  },
  {
    name: "Child First Aid",
    description: "For parents & caregivers.",
    image:
      "https://images.unsplash.com/photo-1755549694163-2006a86567e4?q=80&w=1600&auto=format&fit=crop",
  },
  {
    name: "Corporate Training",
    description: "For organisations & teams.",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1600&auto=format&fit=crop",
  },
];

export default function OurCourses() {
  const [query, setQuery] = useState("");
  const { ref: headerRef, visible: headerVisible } = useRevealOnScroll<HTMLDivElement>();
  const { ref: listRef, visible: listVisible } = useRevealOnScroll<HTMLDivElement>();

  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter(
      (course) =>
        course.name.toLowerCase().includes(q) ||
        course.description.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <section id="courses" className="bg-white px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-[1200px]">
        <div
          ref={headerRef}
          className="mx-auto max-w-2xl text-center transition-all duration-[900ms] ease-out"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(24px)",
            transitionDelay: "100ms",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
            Our Courses
          </p>
          <h2 className="mt-4 text-3xl font-medium tracking-tight text-ink sm:text-[40px]">
            Find the course that&apos;s right for you.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
            Whether you&apos;re renewing your certification, training your
            workplace, or learning first aid for the first time, we have a
            course designed to meet your needs.
          </p>

          <div className="mx-auto mt-8 flex max-w-md items-center gap-3 rounded-full border border-line bg-white px-5 py-3 text-left transition-colors focus-within:border-ink/30">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
              className="shrink-0 text-ink-muted"
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path
                d="M21 21l-4.3-4.3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses..."
              className="w-full bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none"
            />
          </div>
        </div>

        <div
          ref={listRef}
          className="mt-14 grid grid-cols-1 gap-6 transition-all duration-[900ms] ease-out sm:grid-cols-2"
          style={{
            opacity: listVisible ? 1 : 0,
            transform: listVisible ? "translateY(0)" : "translateY(24px)",
            transitionDelay: "150ms",
          }}
        >
          {filteredCourses.map((course) => (
            <div
              key={course.name}
              className="group overflow-hidden rounded-2xl border border-line bg-white transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={course.image}
                  alt={course.name}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-ink">{course.name}</h3>
                <p className="mt-1 text-sm text-ink-muted">{course.description}</p>
              </div>
            </div>
          ))}

          {filteredCourses.length === 0 && (
            <p className="col-span-full py-10 text-center text-sm text-ink-muted">
              No courses match &quot;{query}&quot;.
            </p>
          )}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href="#contact"
            className="rounded-full border border-line px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-black/[0.03]"
          >
            View All Courses
          </a>
        </div>
      </div>
    </section>
  );
}
