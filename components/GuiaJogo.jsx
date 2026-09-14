'use client';

import { useEffect, useState } from 'react';

/**
 * Ajuda do produto (heurística de Nielsen nº 10: help & documentation).
 *
 * Dois modos:
 * - compacto no lobby (sempre visível — reconhecimento, não memorização)
 * - modal na primeira visita, reaberto pelo botão Como jogar
 */

const PASSOS = [
  {
    kicker: '01',
    titulo: 'O que é',
    resumo: 'Dois jogadores, no mesmo aparelho, sem conta.',
    texto: 'Um duelo de dados para duas pessoas no mesmo aparelho. Sem conta, sem internet obrigatória: o progresso fica neste navegador.',
  },
  {
    kicker: '02',
    titulo: 'As regras',
    resumo: 'Dois dados. Maior soma vence. Melhor de 5.',
    texto: 'Cada um lança dois dados (1 a 6). A maior soma vence a rodada. Empate na rodada também conta. São 5 rodadas no total.',
  },
  {
    kicker: '03',
    titulo: 'Na mesa',
    resumo: 'Só um botão Jogar fica ativo por vez.',
    texto: 'Só um botão Jogar fica ativo por vez. Depois das 5 rodadas aparece Jogador 1 venceu, Jogador 2 venceu ou Empate geral, com o botão Jogar Novamente.',
  },
  {
    kicker: '04',
    titulo: 'Seu controle',
    resumo: 'Save automático. Resetar limpa a dupla.',
    texto: 'O save grava sozinho. Jogar Novamente recomeça com os mesmos nomes. Resetar limpa tudo para a próxima dupla.',
  },
];

export function PassosLobby() {
  const [aberto, setAberto] = useState(null);

  function alternar(kicker) {
    setAberto((atual) => (atual === kicker ? null : kicker));
  }

  const passoAberto = PASSOS.find((passo) => passo.kicker === aberto);

  return (
    <div className="como-funciona">
      <ul className="como-funciona-lista" aria-label="Como o jogo funciona">
        {PASSOS.map((passo) => {
          const ativo = aberto === passo.kicker;
          return (
            <li key={passo.kicker}>
              <button
                type="button"
                className={`como-funciona-item ${ativo ? 'aberto' : ''}`}
                aria-expanded={ativo}
                onClick={() => alternar(passo.kicker)}
              >
                <span className="como-funciona-num">{passo.kicker}</span>
                <strong>{passo.titulo}</strong>
                <span className="como-seta" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>
      <div className="como-funciona-corpo" aria-live="polite">
        {passoAberto ? <p>{passoAberto.texto}</p> : (
          <p className="como-funciona-vazio">Escolha um item para ler.</p>
        )}
      </div>
    </div>
  );
}

export default function GuiaJogo({ aberto, onFechar }) {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    if (aberto) setIndice(0);
  }, [aberto]);

  useEffect(() => {
    if (!aberto) return undefined;

    function onKey(event) {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setIndice((atual) => Math.min(PASSOS.length - 1, atual + 1));
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setIndice((atual) => Math.max(0, atual - 1));
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [aberto]);

  if (!aberto) return null;

  const passo = PASSOS[indice];
  const ultimo = indice === PASSOS.length - 1;

  return (
    <div
      className="modal-reset guia-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guia-titulo"
    >
      <div className="modal-reset-caixa guia-caixa">
        <p className="jogo-kicker">como jogar · {indice + 1} / {PASSOS.length}</p>
        <p className="guia-passo-num">{passo.kicker}</p>
        <h2 id="guia-titulo">{passo.titulo}</h2>
        <p>{passo.texto}</p>

        <div className="guia-dots" role="tablist" aria-label="Passos do guia">
          {PASSOS.map((item, i) => (
            <button
              key={item.kicker}
              type="button"
              role="tab"
              aria-selected={i === indice}
              className={`guia-dot ${i === indice ? 'ativo' : ''}`}
              onClick={() => setIndice(i)}
            >
              <span className="sr-only">{item.titulo}</span>
            </button>
          ))}
        </div>

        <div className="guia-acoes">
          <button
            type="button"
            className="botao-secundario"
            onClick={() => setIndice((atual) => Math.max(0, atual - 1))}
            disabled={indice === 0}
          >
            Anterior
          </button>
          {ultimo ? (
            <button type="button" className="botao-cta" onClick={onFechar}>
              Entendi, quero jogar
            </button>
          ) : (
            <button
              type="button"
              className="botao-cta"
              onClick={() => setIndice((atual) => Math.min(PASSOS.length - 1, atual + 1))}
            >
              Próximo
            </button>
          )}
        </div>

        <button type="button" className="botao-texto guia-pular" onClick={onFechar}>
          Pular introdução
        </button>
      </div>
    </div>
  );
}
