"use client";

import { useState, useRef, useEffect } from "react";

interface BackgroundVideoPlaylistProps {
  videos: string[];
  poster?: string;
  className?: string;
  opacity?: number;
}

export function BackgroundVideoPlaylist({
  videos,
  poster,
  className = "",
  opacity = 0.2
}: BackgroundVideoPlaylistProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnded = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  useEffect(() => {
    // When currentIndex changes, play the new video
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Autoplay prevented or interrupted:", error);
      });
    }
  }, [currentIndex]);

  return (
    <div className={`absolute inset-0 z-0 pointer-events-none ${className}`} style={{ opacity }}>
      <video
        ref={videoRef}
        src={videos[currentIndex]}
        onEnded={handleVideoEnded}
        autoPlay
        muted
        playsInline
        className="h-full w-full object-cover transition-opacity duration-1000"
        poster={poster}
      />
    </div>
  );
}
