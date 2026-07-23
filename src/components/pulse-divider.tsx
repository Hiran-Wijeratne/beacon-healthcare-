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
const FADE_MS = 150; // eases the whole blip in and out at the start/end of its life
const STAGGER_MS = 450;

// Traced from the brand's own favicon/logo pulse icon (public/images/
// favicon-source.png): a small up-notch, a sharp tall spike, a deep dip
// below the baseline, then a smaller recovery bump. (x-offset, y-offset)
// control points around the pulse's current position — SVG y grows
// downward, so the upward strokes use negative offsets. Linear
// interpolation between them is deliberate: that's what gives the source
// icon its sharp, angular strokes rather than smooth curves.
const ECG_POINTS: [number, number][] = [
  [-12, 0],
  [-9, 0],
  [-7.5, -2.5],
  [-6, 0],
  [-3, 0],
  [-1.3, 1],
  [0, -9],
  [1.3, 1.2],
  [3, 0],
  [6.5, -2.8],
  [9, 0],
  [12, 0],
];
const KERNEL_SPAN = -ECG_POINTS[0][0];

function ecgOffset(dx: number) {
  if (dx <= ECG_POINTS[0][0] || dx >= ECG_POINTS[ECG_POINTS.length - 1][0]) return 0;
  for (let i = 0; i < ECG_POINTS.length - 1; i++) {
    const [x0, y0] = ECG_POINTS[i];
    const [x1, y1] = ECG_POINTS[i + 1];
    if (dx >= x0 && dx <= x1) {
      return y0 + ((y1 - y0) * (dx - x0)) / (x1 - x0);
    }
  }
  return 0;
}

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

          const lo = Math.max(0, Math.ceil(currentX - KERNEL_SPAN));
          const hi = Math.min(SAMPLE_COUNT, Math.floor(currentX + KERNEL_SPAN));
          for (let i = lo; i <= hi; i++) {
            ys[i] += fade * ecgOffset(i - currentX);
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
