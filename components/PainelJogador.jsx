'use client';

import Dado from './Dado';
import { nomeTema } from '../lib/temas';

/**
 * Painel de um jogador na mesa.
 *
 * Recebe TUDO por props (padrão React): o pai (JogoDados) guarda o estado;
 * este componente só desenha e avisa o clique via onJogar.
 *
 * @param {'p1'|'p2'} lado classe CSS (ciano ou magenta)
 * @param {string} nome
 * @param {string} tema id da skin do dado
 * @param {(number|null)[]} dados os dois valores
 * @param {number} lance id da rolagem (força a animação 3D)
 * @param {number|null} soma
 * @param {boolean} ativo é a vez desta pessoa
 * @param {boolean} rolando animação em curso
 * @param {boolean} noPalco true = dados grandes no centro; false = faixa de espera embaixo
 * @param {boolean} encerrado partida acabou — esconde os botões Jogar
 * @param {boolean} disabled
 * @param {() => void} onJogar callback (função passada como prop)
 */
export default function PainelJogador({
  lado,
  nome,
  tema,
  dados,
  lance,
  soma,
  ativo,
  noPalco = true,
  rolando,
  encerrado = false,
  disabled,
  onJogar,
}) {
  const inicial = nome.trim().charAt(0).toUpperCase();

  return (
    <section
      className={`jogador-coluna ${lado} ${noPalco ? 'palco' : 'banco'} ${ativo ? 'vez' : ''} ${rolando ? 'lancando' : ''}`}
    >
      <header className="jogador-identidade">
        <span className="lobby-avatar mini-avatar" aria-hidden="true">{inicial}</span>
        <div className="jogador-quem">
          <span className="jogador-nome">{nome}</span>
          <small>{nomeTema(tema)}</small>
        </div>
        {ativo ? <em className="vez-selo">Sua vez</em> : null}
      </header>
      <div
        className={`dados-linha ${soma != null && !rolando ? 'revelada' : ''}`}
        onClick={disabled || !noPalco ? undefined : onJogar}
      >
        <Dado
          valor={dados[0]}
          lance={lance}
          tema={tema}
          rolando={rolando}
          mini={!noPalco}
          pousou={noPalco && soma != null && !rolando}
        />
        <Dado
          valor={dados[1]}
          lance={lance}
          tema={tema}
          rolando={rolando}
          mini={!noPalco}
          pousou={noPalco && soma != null && !rolando}
        />
      </div>
      {noPalco ? (
        <p className={`soma ${soma != null && !rolando ? 'visivel' : ''}`}>
          {soma != null && !rolando ? (
            <>
              <span className="soma-rotulo">Soma</span>
              <strong className="soma-numero">{soma}</strong>
            </>
          ) : (
            'Aguardando'
          )}
        </p>
      ) : (
        <p className="banco-espera">{soma != null ? `Soma ${soma}` : 'Aguardando a vez'}</p>
      )}
      {encerrado ? null : (
        <button className="botao-jogar" type="button" onClick={onJogar} disabled={disabled}>
          {rolando ? 'Rolando...' : 'Jogar'}
        </button>
      )}
    </section>
  );
}
