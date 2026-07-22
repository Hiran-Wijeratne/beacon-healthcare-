"use client";

import { useEffect, useRef } from "react";

const PULSE_EVENT = "beacon:section-pulse";
// A continuous scroll, cursor move, or click session collapses into a single
// trigger — only a gap this long between input events counts as movement
// having stopped, letting the next input start a new trigger.
const IDLE_RESET_MS = 400;

const SAMPLE_COUNT = 100;
const BASELINE_Y = 12;
// Constant travel speed (in viewBox units per ms) so every pulse moves at
// the same visual pace regardless of how far it has to go — this crosses
// the full width of the line in ~1.8s.
const SPEED_PER_MS = 100 / 1800;
const KERNEL_SPAN = 8; // how far the bump's influence reaches on either side
const BUMP_SEPARATION = 2.2;
const SIGMA = 1.1;
const AMPLITUDE = 9;
const FADE_MS = 150; // eases the bump in and out at the start/end of its life
const STAGGER_MS = 450;

let globalTriggerBound = false;

function bindGlobalPulseTrigger() {
  if (globalTriggerBound || typeof window === "undefined") return;
  globalTriggerBound = true;

  let sessionActive = false;
  let idleTimer: ReturnType<typeof setTimeout> | null = null;

  const onActivity = () => {
    if (!sessionActive) {
      sessionActive = true;
      window.dispatchEvent(new Event(PULSE_EVENT));
    }
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      sessionActive = false;
    }, IDLE_RESET_MS);
  };

  window.addEventListener("scroll", onActivity, { passive: true });
  window.addEventListener("mousemove", onActivity);
  window.addEventListener("click", onActivity);
}

type ActivePulse = {
  startX: number;
  bornAt: number;
  durationMs: number;
};

function flatPath() {
  return `M0,${BASELINE_Y} L${SAMPLE_COUNT},${BASELINE_Y}`;
}

export default function PulseDivider({ className = "" }: { className?: string }) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const pulsesRef = useRef<ActivePulse[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    bindGlobalPulseTrigger();

    const tick = (now: number) => {
      const path = pathRef.current;
      if (path) {
        const ys = new Array(SAMPLE_COUNT + 1).fill(BASELINE_Y);

        pulsesRef.current = pulsesRef.current.filter((pulse) => {
          const age = now - pulse.bornAt;
          if (age < 0) return true; // staggered pulse hasn't started yet
          if (age > pulse.durationMs) return false; // finished, drop it

          const currentX = pulse.startX - SPEED_PER_MS * age;
          const fade = Math.min(1, age / FADE_MS, (pulse.durationMs - age) / FADE_MS);
          const amp = AMPLITUDE * fade;

          const lo = Math.max(0, Math.ceil(currentX - KERNEL_SPAN));
          const hi = Math.min(SAMPLE_COUNT, Math.floor(currentX + KERNEL_SPAN));
          for (let i = lo; i <= hi; i++) {
            const d = i - currentX;
            const up = Math.exp(-((d + BUMP_SEPARATION) ** 2) / (2 * SIGMA * SIGMA));
            const down = Math.exp(-((d - BUMP_SEPARATION) ** 2) / (2 * SIGMA * SIGMA));
            ys[i] += amp * (up - down);
          }
          return true;
        });

        if (pulsesRef.current.length > 0) {
          let d = `M0,${ys[0].toFixed(2)}`;
          for (let i = 1; i <= SAMPLE_COUNT; i++) {
            d += ` L${i},${ys[i].toFixed(2)}`;
          }
          path.setAttribute("d", d);
        } else {
          path.setAttribute("d", flatPath());
        }
      }

      rafRef.current = pulsesRef.current.length > 0 ? requestAnimationFrame(tick) : null;
    };

    const ensureLoop = () => {
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const onPulse = () => {
      const now = performance.now();
      // Starts anywhere along the line and travels left, so the distance
      // (and therefore lifetime) varies with where it happens to begin.
      [0, STAGGER_MS].forEach((delay) => {
        const startX = Math.random() * 90 + 5;
        const durationMs = (startX + KERNEL_SPAN) / SPEED_PER_MS;
        pulsesRef.current.push({ startX, bornAt: now + delay, durationMs });
      });
      ensureLoop();
    };

    window.addEventListener(PULSE_EVENT, onPulse);
    return () => {
      window.removeEventListener(PULSE_EVENT, onPulse);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className={`relative h-px w-full ${className}`}>
      <svg
        className="pointer-events-none absolute left-0 top-1/2 h-6 w-full -translate-y-1/2 overflow-visible"
        viewBox={`0 0 ${SAMPLE_COUNT} 24`}
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          ref={pathRef}
          d={flatPath()}
          fill="none"
          stroke="var(--line)"
          strokeWidth={1}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
