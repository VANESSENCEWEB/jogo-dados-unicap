'use client';

/**
 * Vídeo de fundo em loop. Precisa ser Client Component por causa do ref
 * e do .play() — o autoplay mudo só é garantido depois de um gesto (click).
 */

import { useEffect, useRef } from 'react';

export default function FundoVideo() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tentarTocar = () => {
      const play = video.play();
      if (play && typeof play.catch === 'function') {
        play.catch(() => {});
      }
    };

    tentarTocar();
    document.addEventListener('pointerdown', tentarTocar, { once: true });
    return () => document.removeEventListener('pointerdown', tentarTocar);
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        className="fundo-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src="/video-dados.mp4" type="video/mp4" />
      </video>
      <div className="fundo-overlay" aria-hidden="true" />
    </>
  );
}
