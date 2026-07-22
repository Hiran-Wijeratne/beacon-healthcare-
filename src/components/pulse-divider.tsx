"use client";

import { useEffect, useRef, useState } from "react";

const PULSE_EVENT = "beacon:section-pulse";
// A continuous scroll, cursor move, or click session collapses into a single
// trigger — only a gap this long between input events counts as movement
// having stopped, letting the next input start a new trigger.
const IDLE_RESET_MS = 400;
const PULSE_DURATION_MS = 3600;
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

export default function PulseDivider({ className = "" }: { className?: string }) {
  const [pulses, setPulses] = useState<number[]>([]);
  const nextIdRef = useRef(0);

  useEffect(() => {
    bindGlobalPulseTrigger();

    const onPulse = () => {
      const first = nextIdRef.current++;
      const second = nextIdRef.current++;
      setPulses((prev) => [...prev, first, second]);
      window.setTimeout(() => {
        setPulses((prev) => prev.filter((id) => id !== first && id !== second));
      }, PULSE_DURATION_MS + PULSE_STAGGER_MS);
    };

    window.addEventListener(PULSE_EVENT, onPulse);
    return () => window.removeEventListener(PULSE_EVENT, onPulse);
  }, []);

  return (
    <div className={`relative h-px w-full bg-line ${className}`}>
      {pulses.map((id, index) => (
        <svg
          key={id}
          viewBox="0 0 100 24"
          preserveAspectRatio="none"
          aria-hidden
          className="pointer-events-none absolute top-1/2 h-6 w-24 -translate-y-1/2"
          style={{
            animation: `pulse-travel ${PULSE_DURATION_MS}ms ease-in-out both`,
            animationDelay: `${(index % 2) * PULSE_STAGGER_MS}ms`,
          }}
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
