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

    // Plays from the start every time the section becomes fully visible,
    // and resets back to the first frame as soon as it's scrolled fully
    // out of view again — so it's always ready to replay from scratch.
    let wasFullyVisible = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isFullyVisible = entry.intersectionRatio >= 0.99;
        if (isFullyVisible && !wasFullyVisible) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else if (!isFullyVisible && wasFullyVisible) {
          video.pause();
          video.currentTime = 0;
        }
        wasFullyVisible = isFullyVisible;
      },
      { threshold: 1.0 },
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
