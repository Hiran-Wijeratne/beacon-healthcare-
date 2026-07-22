"use client";

import { useEffect, useRef, useState } from "react";

const PULSE_EVENT = "beacon:section-pulse";
// A continuous scroll, cursor move, or click session collapses into a single
// trigger — only a gap this long between input events counts as movement
// having stopped, letting the next input start a new trigger.
const IDLE_RESET_MS = 400;
// How long a pulse takes to cross the full width of the rule — travel time
// for any given pulse is scaled down from this based on how far its random
// start point already is from the exit edge, so every pulse moves at the
// same visual speed rather than the same duration.
const FULL_WIDTH_TRAVEL_MS = 3600;
const EXIT_LEFT_PCT = 108;
const MAX_START_PCT = 70;
const PULSE_STAGGER_MS = 450;

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

type Pulse = {
  id: number;
  startPct: number;
  durationMs: number;
  delayMs: number;
};

function makePulse(id: number, delayMs: number): Pulse {
  const startPct = Math.random() * MAX_START_PCT;
  const durationMs = (FULL_WIDTH_TRAVEL_MS * (EXIT_LEFT_PCT - startPct)) / EXIT_LEFT_PCT;
  return { id, startPct, durationMs, delayMs };
}

export default function PulseDivider({ className = "" }: { className?: string }) {
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const nextIdRef = useRef(0);

  useEffect(() => {
    bindGlobalPulseTrigger();

    const onPulse = () => {
      const first = makePulse(nextIdRef.current++, 0);
      const second = makePulse(nextIdRef.current++, PULSE_STAGGER_MS);
      setPulses((prev) => [...prev, first, second]);
      [first, second].forEach((pulse) => {
        window.setTimeout(() => {
          setPulses((prev) => prev.filter((p) => p.id !== pulse.id));
        }, pulse.delayMs + pulse.durationMs);
      });
    };

    window.addEventListener(PULSE_EVENT, onPulse);
    return () => window.removeEventListener(PULSE_EVENT, onPulse);
  }, []);

  return (
    <div className={`relative h-px w-full bg-line ${className}`}>
      {pulses.map((pulse) => (
        <svg
          key={pulse.id}
          viewBox="0 0 100 24"
          preserveAspectRatio="none"
          aria-hidden
          className="pointer-events-none absolute top-1/2 h-6 w-24 -translate-y-1/2"
          style={
            {
              "--pulse-start": `${pulse.startPct}%`,
              "--pulse-end": `${EXIT_LEFT_PCT}%`,
              animation: `pulse-travel ${pulse.durationMs}ms ease-in-out both`,
              animationDelay: `${pulse.delayMs}ms`,
            } as React.CSSProperties
          }
        >
          <path
            d="M0,12 L34,12 L40,3 L46,21 L52,12 L100,12"
            fill="none"
            stroke="var(--line)"
            strokeWidth={1}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
}
