'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Cursor em forma de dado + rastro, só na navegação de cima.
 * Desliga em toque e se a pessoa pediu menos movimento.
 */
export default function RastroDado({ ativo }) {
  const [pos, setPos] = useState({ x: -80, y: -80 });
  const [trilha, setTrilha] = useState([]);
  const frame = useRef(0);
  const ultimo = useRef(0);

  useEffect(() => {
    if (!ativo) {
      setTrilha([]);
      return undefined;
    }

    const reduz =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches;

    function onMove(event) {
      const x = event.clientX;
      const y = event.clientY;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        setPos({ x, y });
        if (reduz) return;
        const agora = performance.now();
        if (agora - ultimo.current < 32) return;
        ultimo.current = agora;
        setTrilha((atual) => [...atual.slice(-8), { x, y, id: agora }]);
      });
    }

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(frame.current);
    };
  }, [ativo]);

  if (!ativo) return null;

  return (
    <div className="cursor-dado-layer" aria-hidden="true">
      {trilha.map((ponto, i) => (
        <span
          key={ponto.id}
          className="cursor-rastro"
          style={{
            left: ponto.x,
            top: ponto.y,
            opacity: ((i + 1) / trilha.length) * 0.38,
            transform: `translate(-50%, -50%) scale(${0.35 + (i / trilha.length) * 0.45}) rotate(${i * 18}deg)`,
          }}
        >
          🎲
        </span>
      ))}
      <span
        className="cursor-dado"
        style={{ left: pos.x, top: pos.y }}
      >
        🎲
      </span>
    </div>
  );
}
