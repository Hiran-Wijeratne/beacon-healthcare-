"use client";

import { useEffect, useRef } from "react";

export default function FirstAidCabinet() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    // Only starts once the section is entirely within the viewport (not
    // just partially scrolled into view), and only ever once — after that
    // it plays through and stops on its last frame (no loop attribute).
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.99) {
          video.play().catch(() => {});
          observer.disconnect();
        }
      },
      { threshold: 1.0 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="h-screen w-full">
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        className="h-full w-full object-cover"
      >
        <source src={encodeURI("/videos/firstaid cabinet.mp4")} type="video/mp4" />
      </video>
    </section>
  );
}
