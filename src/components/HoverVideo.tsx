'use client';

import { useState } from 'react';

type Props = { videoUrl?: string; className?: string };

export function HoverVideo({ videoUrl, className = 'hoverVideoPreview' }: Props) {
  const [active, setActive] = useState(false);
  const [failed, setFailed] = useState(false);
  if (!videoUrl || failed) return null;
  return <span
    className={className}
    onMouseEnter={() => setActive(true)}
    onMouseLeave={() => setActive(false)}
    aria-hidden="true"
  >
    {active && <video
      className="hoverVideoPlayer"
      src={videoUrl}
      muted
      playsInline
      autoPlay
      loop
      preload="none"
      onError={() => setFailed(true)}
    />}
  </span>;
}
