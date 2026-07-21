"use client";

import { useEffect, useRef, useState } from "react";

const CARD_WIDTH_VW = 84;
const CARD_HEIGHT_VH = 56;
const CARD_MARGIN_TOP_VH = 8;
const CARD_RADIUS_PX = 24;
const TRACK_HEIGHT_VH = 1000;
const GROW_END = 0.25;
const SCRUB_START_GROW_FRACTION = 0.75;
const SCRUB_START = GROW_END * SCRUB_START_GROW_FRACTION;
const RELEASE_START = 0.85;

const PARTICLE_COUNT = 32;
const PARTICLE_FALL_TARGET_PERCENT = 75;
const PARTICLE_FALL_MS = 1800;
const PARTICLE_PAUSE_MS = 700;
const PARTICLE_CYCLE_MS = PARTICLE_FALL_MS + PARTICLE_PAUSE_MS;
const PARTICLE_START_DELAY_MS = 2000;
const PARTICLE_INACTIVITY_MS = 2500;
const WIND_FACTOR = 0.15;
const WIND_DECAY = 0.94;
const WIND_MAX = 60;

// After the video releases back into a card, scrolling snaps back to full
// native speed and carries the reader straight past the reveal animations
// in the sections below before they've had a chance to play. This zone
// slows scrolling down for a stretch beyond the track's end, easing back
// up to full speed rather than cutting off abruptly.
const RESISTANCE_ZONE_VH = 220;
const RESISTANCE_MIN_FACTOR = 0.35;

const overlayLines = [
  { text: "Most days are ordinary.", className: "text-white" },
  { text: "The unexpected rarely announces itself.", className: "text-white" },
  { text: "Confidence comes from knowing what to do.", className: "text-white" },
];

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export default function ScrollVideo({
  src,
  mobileSrc,
}: {
  src: string;
  mobileSrc?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const trackEndYRef = useRef<number | null>(null);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const docTop = rect.top + window.scrollY;
      // Growth should start the moment the card's bottom edge clears the
      // viewport bottom (a gap appears below it) — that happens slightly
      // before the sticky container fully locks to the top of the screen.
      const cardBottomVh = CARD_MARGIN_TOP_VH + CARD_HEIGHT_VH;
      const triggerY = docTop - (vh * (100 - cardBottomVh)) / 100;
      // Progress runs all the way to the track's true bottom edge, not just
      // to where the sticky pin naturally releases (one viewport earlier).
      // Otherwise that last viewport of scrolling has nothing left to
      // animate — the video has already finished sliding away — and shows
      // as a dead, empty gap before the next section appears.
      const endY = docTop + rect.height;
      const span = endY - triggerY;
      trackEndYRef.current = endY;
      setProgress(span > 0 ? clamp01((window.scrollY - triggerY) / span) : 0);
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      const zoneStart = trackEndYRef.current;
      if (zoneStart == null) return;

      const zoneHeight = (window.innerHeight * RESISTANCE_ZONE_VH) / 100;
      const zoneEnd = zoneStart + zoneHeight;
      const scrollY = window.scrollY;
      if (scrollY < zoneStart || scrollY >= zoneEnd) return;

      const t = clamp01((scrollY - zoneStart) / zoneHeight);
      const eased = t * t;
      const factor = RESISTANCE_MIN_FACTOR + (1 - RESISTANCE_MIN_FACTOR) * eased;

      event.preventDefault();
      window.scrollBy(0, event.deltaY * factor);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  const growProgress = clamp01(progress / GROW_END);
  const scrubProgress = clamp01((progress - SCRUB_START) / (1 - SCRUB_START));

  const isFullscreen = progress >= GROW_END;
  const activeLine = Math.min(overlayLines.length - 1, Math.floor(scrubProgress * overlayLines.length));

  const [particles, setParticles] = useState<
    { left: number; size: number; phaseOffsetMs: number }[]
  >([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        left: Math.random() * 90 + 5,
        size: Math.random() * 10 + 6,
        phaseOffsetMs: (i / PARTICLE_COUNT) * PARTICLE_CYCLE_MS,
      })),
    );
  }, []);

  // Particles are driven by real elapsed time while the video is pinned
  // fullscreen, not by scroll position — they keep falling regardless of
  // which way the user scrolls within that state, and reset so the effect
  // plays again if the user leaves and re-enters the section. The clock
  // itself pauses (without resetting) after a stretch of no scrolling or
  // mouse movement, and resumes as soon as the user does either again.
  const [particleElapsedMs, setParticleElapsedMs] = useState(0);
  const accumulatedMsRef = useRef(0);
  const lastTickRef = useRef<number | null>(null);
  const lastActivityRef = useRef(0);

  // The cursor pushes all particles sideways together, like a breeze that
  // follows however the mouse has been moving.
  const windOffsetRef = useRef(0);

  useEffect(() => {
    if (!isFullscreen) {
      accumulatedMsRef.current = 0;
      lastTickRef.current = null;
      setParticleElapsedMs(0);
      return;
    }

    lastActivityRef.current = performance.now();

    const markActivity = () => {
      lastActivityRef.current = performance.now();
    };
    const onMouseMove = (event: MouseEvent) => {
      windOffsetRef.current = Math.max(
        -WIND_MAX,
        Math.min(WIND_MAX, windOffsetRef.current + event.movementX * WIND_FACTOR),
      );
      markActivity();
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", markActivity, { passive: true });

    let rafId: number;
    const tick = (now: number) => {
      windOffsetRef.current *= WIND_DECAY;
      if (lastTickRef.current !== null) {
        const idle = now - lastActivityRef.current > PARTICLE_INACTIVITY_MS;
        if (!idle) {
          accumulatedMsRef.current += now - lastTickRef.current;
        }
      }
      lastTickRef.current = now;
      setParticleElapsedMs(accumulatedMsRef.current);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", markActivity);
      cancelAnimationFrame(rafId);
    };
  }, [isFullscreen]);

  const showParticles = isFullscreen && particleElapsedMs >= PARTICLE_START_DELAY_MS;
  const activeParticleMs = Math.max(0, particleElapsedMs - PARTICLE_START_DELAY_MS);

  // The final stretch plays out with the fullscreen box shrinking back
  // down into a small card again — the entrance in reverse — rather than
  // sliding off screen. An ease-in curve makes the shrink start slowly
  // (scrolling feels "stuck" right after the video ends) and pick up
  // speed toward the end, rather than a constant, sudden rate.
  const releaseProgress = clamp01((scrubProgress - RELEASE_START) / (1 - RELEASE_START));
  const easedReleaseProgress = releaseProgress * releaseProgress * releaseProgress;
  const boxProgress = growProgress * (1 - easedReleaseProgress);

  const width = CARD_WIDTH_VW + (100 - CARD_WIDTH_VW) * boxProgress;
  const height = CARD_HEIGHT_VH + (100 - CARD_HEIGHT_VH) * boxProgress;
  const marginTop = CARD_MARGIN_TOP_VH * (1 - boxProgress);
  const radius = CARD_RADIUS_PX * (1 - boxProgress);

  const targetTimeRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const seekToTarget = () => {
      if (video.seeking || Number.isNaN(video.duration)) return;
      const target = targetTimeRef.current;
      if (Math.abs(video.currentTime - target) > 1 / 60) {
        video.currentTime = target;
      }
    };

    video.addEventListener("seeked", seekToTarget);
    video.addEventListener("loadedmetadata", seekToTarget);
    return () => {
      video.removeEventListener("seeked", seekToTarget);
      video.removeEventListener("loadedmetadata", seekToTarget);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || Number.isNaN(video.duration)) return;
    targetTimeRef.current = progress < SCRUB_START ? 0 : scrubProgress * video.duration;
    if (!video.seeking) {
      video.currentTime = targetTimeRef.current;
    }
  }, [progress, scrubProgress]);

  return (
    <div
      id="why-beacon"
      ref={trackRef}
      className="relative -mt-12 sm:-mt-16"
      style={{ height: `${TRACK_HEIGHT_VH}vh` }}
    >
      <div className="sticky top-0 flex h-screen w-full items-start justify-center overflow-hidden bg-paper">
        <div
          className="relative overflow-hidden shadow-xl"
          style={{
            width: `${width}vw`,
            height: `${height}vh`,
            marginTop: `${marginTop}vh`,
            borderRadius: `${radius}px`,
          }}
        >
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
          >
            {mobileSrc && (
              <source media="(max-width: 639px)" src={encodeURI(mobileSrc)} type="video/mp4" />
            )}
            <source src={encodeURI(src)} type="video/mp4" />
          </video>

          {showParticles && (
            <div
              className="absolute inset-0 transition-opacity duration-300"
              style={{
                transform: `translateX(${windOffsetRef.current}px)`,
                opacity: 1 - easedReleaseProgress,
              }}
            >
              {particles.map((particle, index) => {
                const localTime = (activeParticleMs + particle.phaseOffsetMs) % PARTICLE_CYCLE_MS;
                const fallProgress = clamp01(localTime / PARTICLE_FALL_MS);
                const visible = localTime < PARTICLE_FALL_MS;
                return (
                  <div
                    key={index}
                    className="absolute rounded-full transition-opacity duration-300"
                    style={{
                      left: `${particle.left}%`,
                      top: `${fallProgress * PARTICLE_FALL_TARGET_PERCENT}%`,
                      width: `${particle.size}px`,
                      height: `${particle.size}px`,
                      backgroundColor: "#fee590",
                      opacity: visible ? 1 : 0,
                    }}
                  />
                );
              })}
            </div>
          )}

          {overlayLines.map((line, index) => (
            <div
              key={line.text}
              className="absolute inset-0 flex flex-col items-start justify-center pb-24 pl-16 pr-8 transition-opacity duration-500 sm:pb-32 sm:pl-28 sm:pr-16"
              style={{
                opacity:
                  isFullscreen && activeLine === index ? 1 - easedReleaseProgress : 0,
                pointerEvents: isFullscreen && activeLine === index ? "auto" : "none",
              }}
            >
              <p
                className={`max-w-xl text-3xl font-medium tracking-tight sm:text-[40px] ${line.className}`}
              >
                {line.text}
              </p>
              {index === overlayLines.length - 1 && (
                <a
                  href="#contact"
                  className="mt-8 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-paper transition-opacity hover:opacity-90 sm:text-base"
                >
                  Get Certified with Confidence
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
