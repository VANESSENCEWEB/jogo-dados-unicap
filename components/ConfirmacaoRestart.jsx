'use client';

/**
 * Modal de confirmação do RESET.
 *
 * Props:
 * - aberto {boolean} se false, não renderiza nada (early return)
 * - onCancelar {function}
 * - onConfirmar {function} — o pai é quem apaga o localStorage
 */
export default function ConfirmacaoRestart({ aberto, onCancelar, onConfirmar }) {
  if (!aberto) return null;

  return (
    <div
      className="modal-reset"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-titulo"
    >
      <div className="modal-reset-caixa">
        <p className="jogo-kicker">cuidado</p>
        <h2 id="reset-titulo">Resetar temporada?</h2>
        <p>
          Isso apaga nomes, skins, placar e a partida salva neste navegador.
          Os próximos jogadores entram do zero.
        </p>
        <div className="modal-reset-acoes">
          <button type="button" className="botao-secundario" onClick={onCancelar}>
            Cancelar
          </button>
          <button type="button" className="botao-reset-confirmar" onClick={onConfirmar}>
            Resetar tudo
          </button>
        </div>
      </div>
    </div>
  );
}
