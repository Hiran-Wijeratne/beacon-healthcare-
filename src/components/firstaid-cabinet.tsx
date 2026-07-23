"use client";

import { useEffect, useRef, useState } from "react";

const PLAYBACK_DURATION_S = 1;

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

    // Starts as soon as a quarter of the section has scrolled into view
    // (not waiting for it to be fully on screen), then plays through to
    // its last frame while the user stays anywhere in or near the section
    // — it only resets once the section leaves the viewport entirely
    // (scrolled fully out, above or below), ready to play from the start
    // again the next time it's scrolled back into view.
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
        if (entry.intersectionRatio >= 0.25 && !hasPlayedSinceLastExit) {
          video.currentTime = 0;
          setShowText(false);
          video.play().catch(() => {});
          hasPlayedSinceLastExit = true;
        }
      },
      { threshold: [0, 0.25] },
    );
    observer.observe(section);

    return () => {
      observer.disconnect();
      video.removeEventListener("loadedmetadata", applyPlaybackSpeed);
      video.removeEventListener("ended", onEnded);
    };
  }, []);

  return (
    <section ref={sectionRef} className="flex justify-center bg-white px-6 py-20 sm:py-28">
      <div className="relative w-full sm:w-3/4">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nofullscreen nodownload noremoteplayback noplaybackrate"
          className="block w-full bg-white [transform:translateZ(0)]"
        >
          <source src={encodeURI("/videos/firstaid cabinet.mp4")} type="video/mp4" />
        </video>

        {/* Matches the open cabinet's interior cavity in the video's last
            frame (measured from the source footage), not the whole frame. */}
        <div
          className={`pointer-events-none absolute left-[38.5%] top-[14%] flex h-[70%] w-[44%] flex-col items-center justify-center gap-[6%] p-[3%] text-center transition-opacity duration-700 ease-out ${
            showText ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex flex-col items-center gap-[clamp(2px,1vw,10px)]">
            <p className="text-[clamp(0.75rem,3vw,2.55rem)] font-medium leading-none tracking-tight text-ink">
              The moment you need
              <br />
              a first aid kit...
            </p>
            <p className="text-[clamp(0.75rem,3vw,2.55rem)] font-medium leading-none tracking-tight text-ink">
              you should already
              <br />
              know what to do.
            </p>
          </div>
          <p className="text-[clamp(0.6rem,2.2vw,1.9rem)] leading-relaxed text-ink-muted">
            Preparation begins long before an emergency.
          </p>
        </div>
      </div>
    </section>
  );
}
