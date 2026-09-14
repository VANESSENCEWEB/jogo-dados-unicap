'use client';

/**
 * HUD gamer no rodapé: atalhos de teclado visíveis, como em um jogo de PC.
 * Não executa os atalhos — só informa. A lógica fica no JogoDados.
 */
export default function HudComandos({ naMesa }) {
  return (
    <footer className="hud-comandos" aria-label="Atalhos de teclado">
      <span className="hud-teclas-seta">
        <kbd>←</kbd>
        <kbd>→</kbd>
        skin
      </span>
      <span><kbd>?</kbd> como jogar</span>
      <span><kbd>F</kbd> tela cheia</span>
      <span><kbd>M</kbd> som</span>
      {naMesa ? <span><kbd>Esc</kbd> sala</span> : null}
      {naMesa ? <span><kbd>Espaço</kbd> jogar</span> : null}
      <span><kbd>Shift</kbd>+<kbd>R</kbd> resetar</span>
      <span className="hud-credito">UNICAP · 2026</span>
    </footer>
  );
}
