'use client';

import { useEffect, useRef, useState } from 'react';
import Dado from './Dado';
import { PassosLobby } from './GuiaJogo';
import { TEMAS } from '../lib/temas';
import { useSugestaoNick } from '../hooks/useSugestaoNick';
import { tocarCliqueUi } from '../lib/som';

/**
 * Sala em dois passos: primeiro o Jogador 1, depois o Jogador 2.
 * Um card por vez deixa o dado maior e o hover mais fácil de ver.
 */
export default function Lobby({
  perfil,
  estatisticas,
  partidaSalva,
  onChangeJogador,
  onEntrar,
  onContinuar,
}) {
  const [passo, setPasso] = useState(1);
  const acoesRef = useRef(null);
  const jogador1 = passo === 1;
  const jogador = jogador1 ? perfil.jogador1 : perfil.jogador2;
  const lado = jogador1 ? 'jogador1' : 'jogador2';
  const titulo = jogador1 ? 'Jogador 1' : 'Jogador 2';

  useEffect(() => {
    if (passo !== 2) return;
    const campo = document.getElementById('nome-jogador2');
    campo?.focus({ preventScroll: true });
    campo?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [passo]);

  return (
    <div className="lobby lobby-viewport">
      <h1 className="sr-only">Jogue Dados</h1>

      <div className="lobby-palco">
        <aside className="lobby-ajuda">
          <PassosLobby />
        </aside>

        <div className="lobby-mesa lobby-mesa-solo">
          <CartaoJogador
            key={lado}
            lado={lado}
            titulo={titulo}
            dica={
              jogador1
                ? 'Digite o nome do Jogador 1 ou gere automaticamente com a API.'
                : 'Digite o nome do Jogador 2 ou gere automaticamente com a API.'
            }
            jogador={jogador}
            vitorias={jogador1 ? estatisticas.vitorias1 : estatisticas.vitorias2}
            onChange={onChangeJogador}
            onSalvou={
              jogador1
                ? () => setPasso(2)
                : () => acoesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
            }
          />
        </div>

        <aside className="lobby-lado">
          <p className="lobby-lado-titulo">Quem entra na mesa</p>
          <div className="lobby-etapas" role="tablist" aria-label="Passos da dupla">
            <button
              type="button"
              role="tab"
              aria-selected={jogador1}
              className={jogador1 ? 'ativo' : ''}
              onClick={() => setPasso(1)}
            >
              <span>01</span>
              Jogador 1
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={!jogador1}
              className={!jogador1 ? 'ativo' : ''}
              onClick={() => setPasso(2)}
            >
              <span>02</span>
              Jogador 2
            </button>
          </div>

          <p className="lobby-lado-titulo">Estatísticas gerais</p>
          <dl className="lobby-stats" aria-label="Temporada neste navegador">
            <div>
              <dt>Partidas</dt>
              <dd>{estatisticas.partidas}</dd>
            </div>
            <div>
              <dt>Empates</dt>
              <dd>{estatisticas.empates}</dd>
            </div>
          </dl>

          <div className="lobby-acoes" ref={acoesRef}>
            {jogador1 ? (
              <button className="botao-cta" type="button" onClick={() => setPasso(2)}>
                <span>Continuar</span>
                <small>para o Jogador 2</small>
              </button>
            ) : (
              <>
                <button className="botao-cta" type="button" onClick={onEntrar}>
                  <span>Entrar na mesa</span>
                </button>
                <button className="botao-secundario" type="button" onClick={() => setPasso(1)}>
                  Voltar ao Jogador 1
                </button>
              </>
            )}
            {partidaSalva ? (
              <button className="botao-secundario" type="button" onClick={onContinuar}>
                Continuar partida salva
              </button>
            ) : null}
            <p className="lobby-dica-cta">
              {jogador1
                ? 'Nome vazio vira Jogador 1. Use as setas para mudar a cor do dado.'
                : 'Nome vazio vira Jogador 2. O nick da API é opcional. O progresso grava sozinho.'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function CartaoJogador({ lado, titulo, dica, jogador, vitorias, onChange, onSalvou }) {
  const { buscarNick, carregando, erro } = useSugestaoNick();
  const inputId = `nome-${lado}`;
  const statusId = `${lado}-status`;
  const tema = TEMAS.find((item) => item.id === jogador.tema) || TEMAS[0];
  const [status, setStatus] = useState('');

  function avisar(texto) {
    setStatus(texto);
    tocarCliqueUi();
  }

  function salvarNome() {
    const nome = (jogador.nome || '').trim();
    onChange(lado, { nome });
    avisar(nome ? `Nome do ${titulo} salvo: ${nome}` : `Nome do ${titulo} em branco. Na mesa vira ${titulo}.`);
    onSalvou?.();
  }

  async function gerarNick() {
    const nick = await buscarNick();
    if (nick) {
      onChange(lado, { nome: nick });
      avisar(`Nome do ${titulo} gerado e salvo: ${nick}`);
      onSalvou?.();
    }
  }

  return (
    <section
      className={`lobby-card ${lado}`}
      aria-labelledby={`${lado}-titulo`}
      style={{ '--tema-cor': tema.cor }}
    >
      <p className="lobby-card-titulo" id={`${lado}-titulo`}>{titulo}</p>
      <p className="lobby-card-dica">{dica}</p>

      <SeletorSkin
        lado={lado}
        temaId={jogador.tema}
        onChange={onChange}
      />

      <div className="lobby-nome">
        <label className="lobby-campo" htmlFor={inputId}>
          <span>Nome do {titulo}</span>
          <input
            id={inputId}
            maxLength={16}
            value={jogador.nome}
            placeholder={`Digite o nome do ${titulo}`}
            autoComplete="nickname"
            aria-describedby={status ? statusId : undefined}
            onChange={(event) => {
              setStatus('');
              onChange(lado, { nome: event.target.value });
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                salvarNome();
              }
            }}
          />
        </label>
        <div className="lobby-nome-acoes">
          <button type="button" className="botao-salvar" onClick={salvarNome}>
            Salvar nome
          </button>
          <button
            type="button"
            className="botao-nick"
            onClick={gerarNick}
            disabled={carregando}
            aria-describedby={erro ? `${lado}-erro` : undefined}
          >
            {carregando ? 'Gerando…' : 'Gerar automaticamente'}
          </button>
        </div>
      </div>
      {status ? <p className="lobby-nome-status" id={statusId} role="status">{status}</p> : null}
      {erro ? <p className="lobby-erro" id={`${lado}-erro`} role="alert">{erro}</p> : null}

      <p className="lobby-vitorias">{vitorias} {vitorias === 1 ? 'vitória' : 'vitórias'}</p>
    </section>
  );
}

function SeletorSkin({ lado, temaId, onChange }) {
  const indice = Math.max(0, TEMAS.findIndex((tema) => tema.id === temaId));
  const tema = TEMAS[indice] || TEMAS[0];

  function ir(delta) {
    const proximo = (indice + delta + TEMAS.length) % TEMAS.length;
    onChange(lado, { tema: TEMAS[proximo].id });
    tocarCliqueUi();
  }

  useEffect(() => {
    function onKey(event) {
      const alvo = event.target;
      if (!(alvo instanceof Element)) return;
      const tag = alvo.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (alvo.closest('summary')) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        ir(-1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        ir(1);
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [indice, lado, onChange]);

  return (
    <div className="skin-carrossel">
      <p className="lobby-skins-label" id={`${lado}-skins`}>Cor do dado</p>
      <div className="skin-palco">
        <button
          type="button"
          className="skin-seta"
          onClick={() => ir(-1)}
          aria-label="Skin anterior"
        >
          ‹
        </button>
        <div className="skin-dado-wrap">
          <Dado valor={5} tema={tema.id} estatico />
        </div>
        <button
          type="button"
          className="skin-seta"
          onClick={() => ir(1)}
          aria-label="Próxima skin"
        >
          ›
        </button>
      </div>
      <p className="skin-nome">{tema.nome}</p>
      <p className="skin-desc">{tema.descricao}</p>
      <p className="skin-teclado" aria-hidden="true">
        <kbd>←</kbd>
        <kbd>→</kbd>
        <span>teclado</span>
      </p>
      <div className="skin-dots" role="tablist" aria-labelledby={`${lado}-skins`}>
        {TEMAS.map((item, i) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            className={`skin-dot ${i === indice ? 'ativo' : ''}`}
            aria-selected={i === indice}
            aria-label={item.nome}
            onClick={() => {
              onChange(lado, { tema: item.id });
              tocarCliqueUi();
            }}
          />
        ))}
      </div>
    </div>
  );
}
