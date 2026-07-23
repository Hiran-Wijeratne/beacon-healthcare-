"use client";

import { useEffect, useRef } from "react";

const PULSE_EVENT = "beacon:section-pulse";
// A continuous scroll, cursor move, or click session collapses into a single
// trigger — only a gap this long between input events counts as movement
// having stopped, letting the next input start a new trigger.
const IDLE_RESET_MS = 400;

const BASELINE_Y = 12;
const WIDTH = 100; // viewBox width, in the same units as every x below
const SAMPLE_STEP = 0.5; // finer than 1 unit so the rounded P/T humps read as curves, not facets

// A normal sinus rhythm complex, built from named segments rather than a
// generic point list: P and T are smooth raised-cosine humps (no kinks at
// their edges), Q/R/S are narrow linear spikes — the sharp angularity is
// deliberately confined to the QRS complex, everything else is a curve.
// Positioned so the whole shape sits fully off-screen at entry and exit;
// x-offsets are relative to the pulse's current head position, and are
// negative-first (P) to positive-last (T) to read left-to-right in time
// as the head travels rightward — see currentX below.
type Hump = { kind: "cosine" | "triangle"; center: number; halfWidth: number; amplitude: number };

const SEGMENTS: Hump[] = [
  { kind: "cosine", center: -7.5, halfWidth: 1.8, amplitude: -1.4 }, // P wave (up, smooth)
  { kind: "triangle", center: -1.1, halfWidth: 0.5, amplitude: 0.7 }, // Q dip (down, sharp)
  { kind: "triangle", center: 0, halfWidth: 0.6, amplitude: -7 }, // R spike (up, tall, sharp)
  { kind: "triangle", center: 0.9, halfWidth: 0.5, amplitude: 0.85 }, // S dip (down, sharp, deeper than Q)
  { kind: "cosine", center: 6.5, halfWidth: 2.8, amplitude: -1.7 }, // T wave (up, broad, smooth)
];
const KERNEL_SPAN = Math.max(...SEGMENTS.map((s) => Math.abs(s.center) + s.halfWidth));

function ecgOffset(dx: number) {
  let y = 0;
  for (const seg of SEGMENTS) {
    const d = dx - seg.center;
    if (Math.abs(d) >= seg.halfWidth) continue;
    y +=
      seg.kind === "cosine"
        ? seg.amplitude * 0.5 * (1 + Math.cos((Math.PI * d) / seg.halfWidth))
        : seg.amplitude * (1 - Math.abs(d) / seg.halfWidth);
  }
  return y;
}

// Constant travel speed (viewBox units per ms), covering the full entry-to-
// exit distance in a fixed time — the beat moves at one steady pace, never
// easing or overshooting.
const ENTRY_X = -KERNEL_SPAN;
const EXIT_X = WIDTH + KERNEL_SPAN;
const TRAVEL_MS = 2200;
const SPEED_PER_MS = (EXIT_X - ENTRY_X) / TRAVEL_MS;

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

// Empty (zero-length) so the active-segment overlay disappears cleanly
// between heartbeats, leaving only the permanent gray guide line below it.
const EMPTY_PATH = `M0,${BASELINE_Y}`;

export default function PulseDivider({ className = "" }: { className?: string }) {
  const activePathRef = useRef<SVGPathElement | null>(null);
  const bornAtRef = useRef<number | null>(null); // null while no heartbeat is in flight
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    bindGlobalPulseTrigger();

    const tick = (now: number) => {
      const path = activePathRef.current;
      const bornAt = bornAtRef.current;

      if (path && bornAt != null) {
        const age = now - bornAt;
        if (age > TRAVEL_MS) {
          bornAtRef.current = null;
          path.setAttribute("d", EMPTY_PATH);
        } else {
          const currentX = ENTRY_X + SPEED_PER_MS * age;
          const lo = Math.max(0, currentX - KERNEL_SPAN);
          const hi = Math.min(WIDTH, currentX + KERNEL_SPAN);

          let d = `M${lo.toFixed(2)},${BASELINE_Y}`;
          for (let x = Math.ceil(lo / SAMPLE_STEP) * SAMPLE_STEP; x <= hi; x += SAMPLE_STEP) {
            const y = BASELINE_Y + ecgOffset(currentX - x);
            d += ` L${x.toFixed(2)},${y.toFixed(2)}`;
          }
          path.setAttribute("d", d);
        }
      }

      rafRef.current = bornAtRef.current != null ? requestAnimationFrame(tick) : null;
    };

    const onPulse = () => {
      if (bornAtRef.current != null) return; // only one heartbeat on the line at a time
      bornAtRef.current = performance.now();
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(tick);
      }
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
        viewBox={`0 0 ${WIDTH} 24`}
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* Permanent resting guide — identical to the plain divider line. */}
        <path
          d={`M0,${BASELINE_Y} L${WIDTH},${BASELINE_Y}`}
          fill="none"
          stroke="var(--line)"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
        {/* Active heartbeat segment — same line, brand-red, only while travelling. */}
        <path
          ref={activePathRef}
          d={EMPTY_PATH}
          fill="none"
          stroke="#af3337"
          strokeWidth={1}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
