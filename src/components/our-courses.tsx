"use client";

import { useState } from "react";
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
  const [active, setActive] = useState(0);
  const [openMobile, setOpenMobile] = useState<number | null>(null);
  const header = useRevealOnScroll<HTMLDivElement>();
  const list = useRevealOnScroll<HTMLDivElement>();

  return (
    <section id="courses" className="bg-white px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-[1200px]">
        <div
          ref={header.ref}
          className="mx-auto max-w-2xl text-center transition-all duration-[900ms] ease-out"
          style={{
            opacity: header.visible ? 1 : 0,
            transform: header.visible ? "translateY(0)" : "translateY(24px)",
            transitionDelay: "100ms",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-black/50">
            Our Courses
          </p>
          <h2 className="mt-4 text-3xl font-medium tracking-tight text-black sm:text-[40px]">
            Find the course that&apos;s right for you.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-black/60">
            Whether you&apos;re renewing your certification, training your
            workplace, or learning first aid for the first time, we have a
            course designed to meet your needs.
          </p>
        </div>

        <div
          ref={list.ref}
          className="mt-20 grid gap-4 transition-all duration-[900ms] ease-out lg:grid-cols-[3fr_2fr] lg:gap-16"
          style={{
            opacity: list.visible ? 1 : 0,
            transform: list.visible ? "translateY(0)" : "translateY(24px)",
            transitionDelay: "150ms",
          }}
        >
          <div className="relative hidden aspect-[16/10] overflow-hidden rounded-xl lg:block">
            {courses.map((course, i) => (
              <img
                key={course.name}
                src={course.image}
                alt={course.name}
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out"
                style={{ opacity: active === i ? 1 : 0 }}
              />
            ))}
          </div>

          <div className="flex flex-col">
            {courses.map((course, i) => (
              <div key={course.name} className="border-b border-[#E8E8E8] first:border-t">
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="hidden w-full items-center justify-between gap-6 py-7 text-left transition-colors duration-300 lg:flex"
                  style={{
                    backgroundColor: active === i ? "rgba(0,0,0,0.02)" : "transparent",
                  }}
                >
                  <div>
                    <div
                      className="inline-block origin-left text-lg font-medium transition-all duration-300"
                      style={{
                        color: active === i ? "#000000" : "rgba(0,0,0,0.4)",
                        transform: active === i ? "scale(1.03)" : "scale(1)",
                      }}
                    >
                      {course.name}
                    </div>
                    <p className="mt-1 text-sm text-black/40">{course.description}</p>
                  </div>
                  <span
                    className="shrink-0 text-xl text-black transition-transform duration-300"
                    style={{ transform: `translateX(${active === i ? 8 : 0}px)` }}
                  >
                    →
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setOpenMobile(openMobile === i ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left lg:hidden"
                >
                  <div>
                    <div className="text-lg font-medium text-black">{course.name}</div>
                    <p className="mt-1 text-sm text-black/40">{course.description}</p>
                  </div>
                  <span
                    className="shrink-0 text-xl text-black transition-transform duration-300"
                    style={{
                      transform: openMobile === i ? "rotate(90deg)" : "rotate(0deg)",
                    }}
                  >
                    →
                  </span>
                </button>
                {openMobile === i && (
                  <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-xl lg:hidden">
                    <img
                      src={course.image}
                      alt={course.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
