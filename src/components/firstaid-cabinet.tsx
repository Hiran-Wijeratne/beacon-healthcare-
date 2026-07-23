"use client";

import { useEffect, useRef } from "react";

const PLAYBACK_DURATION_S = 1.5;

export default function FirstAidCabinet() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
          return;
        }
        if (entry.intersectionRatio >= 0.99 && !hasPlayedSinceLastExit) {
          video.currentTime = 0;
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
    };
  }, []);

  return (
    <section ref={sectionRef} className="flex justify-center bg-white px-6">
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        className="w-3/4"
      >
        <source src={encodeURI("/videos/firstaid cabinet.mp4")} type="video/mp4" />
      </video>
    </section>
  );
}
