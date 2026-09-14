'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Liga/desliga tela cheia (Fullscreen API do navegador).
 * Experiência "gamer" no PC: o site ocupa o monitor inteiro, sem barra do Chrome.
 */
export function useTelaCheia() {
  const [ativa, setAtiva] = useState(false);

  useEffect(() => {
    function sincronizar() {
      setAtiva(Boolean(document.fullscreenElement));
    }
    document.addEventListener('fullscreenchange', sincronizar);
    return () => document.removeEventListener('fullscreenchange', sincronizar);
  }, []);

  const alternar = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  return { ativa, alternar };
}
