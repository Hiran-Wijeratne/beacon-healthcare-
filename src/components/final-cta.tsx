"use client";

import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";

const navLinks = [
  { href: "#why-beacon", label: "About" },
  { href: "#courses", label: "Courses" },
  { href: "#corporate", label: "Corporate Training" },
  { href: "#contact", label: "Registration" },
  { href: "#contact", label: "Contact" },
];

const contactDetails = [
  { label: "Phone", value: "+65 6789 0123" },
  { label: "Email", value: "hello@beaconhealthcare.sg" },
  { label: "Address", value: "10 Anson Road, Singapore 079903" },
];

const socialLinks = ["LinkedIn", "Facebook", "Instagram"];

export default function FinalCta() {
  const { ref, visible } = useRevealOnScroll<HTMLDivElement>();

  const riseStyle = (delayMs: number, durationMs = 700) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transitionDelay: `${delayMs}ms`,
    transitionDuration: `${durationMs}ms`,
  });

  return (
    <section id="contact" className="border-t border-line bg-white">
      <div
        ref={ref}
        className="mx-auto max-w-[1280px] px-6 pt-20 sm:pt-28"
      >
        {/* CTA */}
        <div className="mx-auto max-w-2xl text-center">
          <p
            className="text-xs font-semibold uppercase tracking-widest text-ink-muted transition-all ease-out"
            style={riseStyle(100)}
          >
            Be Ready
          </p>
          <h2
            className="mt-6 text-4xl font-medium leading-[1.1] tracking-tight text-ink transition-all ease-out sm:text-5xl lg:text-6xl"
            style={riseStyle(280)}
          >
            Preparation starts
            <br />
            with one decision.
          </h2>
          <p
            className="mx-auto mt-6 max-w-[620px] text-lg leading-relaxed text-ink-muted transition-all ease-out"
            style={riseStyle(460)}
          >
            Every certification is more than a qualification. It&apos;s the
            confidence to stay calm, respond with purpose, and make a
            difference when it matters most.
          </p>

          <div
            className="mt-12 flex flex-col items-center justify-center gap-4 transition-all ease-out sm:flex-row"
            style={riseStyle(650)}
          >
            <a
              href="#courses"
              className="rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-paper transition-opacity hover:opacity-90 sm:text-base"
            >
              Register for a Course
            </a>
            <a
              href="#contact"
              className="rounded-full border border-line px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-black/[0.03] sm:text-base"
            >
              Contact Us
            </a>
          </div>
        </div>

        {/* Footer */}
        <div
          className="mt-[72px] border-t border-line pt-16 transition-all duration-[900ms] ease-out sm:mt-[120px]"
          style={riseStyle(850, 900)}
        >
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            <div>
              <p className="text-sm font-semibold text-ink">Beacon Healthcare</p>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
                Preparing individuals, workplaces and organisations with
                practical, accredited first aid training across Singapore.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
                Navigation
              </p>
              <ul className="mt-4 space-y-3">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-ink-muted transition-colors duration-200 hover:text-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
                Contact
              </p>
              <ul className="mt-4 space-y-3">
                {contactDetails.map((detail) => (
                  <li key={detail.label} className="text-sm text-ink-muted">
                    {detail.value}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
                Follow
              </p>
              <ul className="mt-4 space-y-3">
                {socialLinks.map((label) => (
                  <li key={label}>
                    <a
                      href="#"
                      className="text-sm text-ink-muted transition-colors duration-200 hover:text-ink"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-center gap-3 border-t border-line pt-8 pb-8 text-xs text-ink-muted sm:flex-row sm:justify-between">
            <p>© 2026 Beacon Healthcare</p>
            <p>SRFAC Accredited Training Centre</p>
          </div>
        </div>
      </div>
    </section>
  );
}
