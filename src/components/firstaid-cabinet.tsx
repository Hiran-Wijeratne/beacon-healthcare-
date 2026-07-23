"use client";

import { useEffect, useRef, useState } from "react";

const PLAYBACK_DURATION_S = 0.6;

export default function FirstAidCabinet() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    // Speeds the clip up so it always finishes within PLAYBACK_DURATION_S,
    // however long the source file actually runs.
    const applyPlaybackSpeed = () => {
      if (video.duration) {
        video.playbackRate = video.duration / PLAYBACK_DURATION_S;
      }
    };
    applyPlaybackSpeed();
    video.addEventListener("loadedmetadata", applyPlaybackSpeed);

    // The overlay text only appears once the video has actually finished
    // and is resting on its last frame — never mid-playback.
    const onEnded = () => setShowText(true);
    video.addEventListener("ended", onEnded);

    // Starts once the section is fully visible and is left alone to play
    // through to its last frame while the user stays anywhere in or near
    // the section — it only resets once the section leaves the viewport
    // entirely (scrolled fully out, above or below), ready to play from
    // the start again the next time it's scrolled back into full view.
    let hasPlayedSinceLastExit = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          video.pause();
          video.currentTime = 0;
          hasPlayedSinceLastExit = false;
          setShowText(false);
          return;
        }
        if (entry.intersectionRatio >= 0.99 && !hasPlayedSinceLastExit) {
          video.currentTime = 0;
          setShowText(false);
          video.play().catch(() => {});
          hasPlayedSinceLastExit = true;
        }
      },
      { threshold: [0, 1.0] },
    );
    observer.observe(section);

    return () => {
      observer.disconnect();
      video.removeEventListener("loadedmetadata", applyPlaybackSpeed);
      video.removeEventListener("ended", onEnded);
    };
  }, []);

  return (
    <section ref={sectionRef} className="flex justify-center bg-white px-6">
      <div className="relative w-3/4">
        <video ref={videoRef} muted playsInline preload="auto" className="block w-full">
          <source src={encodeURI("/videos/firstaid cabinet.mp4")} type="video/mp4" />
        </video>

        {/* Matches the open cabinet's interior cavity in the video's last
            frame (measured from the source footage), not the whole frame. */}
        <div
          className={`pointer-events-none absolute left-[38.5%] top-[14%] flex h-[70%] w-[44%] flex-col items-center justify-center gap-[6%] p-[3%] text-center transition-opacity duration-700 ease-out ${
            showText ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-[clamp(0.75rem,1.6vw,1.35rem)] font-semibold leading-snug tracking-tight text-ink">
            The moment you need a first aid kit...
            <br />
            ...isn&apos;t the moment to wonder what to do.
          </p>
          <p className="text-[clamp(0.6rem,1.15vw,1rem)] leading-snug text-ink-muted">
            The decisions that matter most are made long before an emergency
            begins.
          </p>
        </div>
      </div>
    </section>
  );
}
