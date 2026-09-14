'use client';

/**
 * Componente-cérebro da aplicação.
 *
 * 'use client' = precisa rodar no browser (useState, eventos, localStorage).
 * O page.js (Server Component) só importa este arquivo.
 *
 * Fluxo que o professor costuma pedir:
 * 1) estado no React (useState)
 * 2) props para filhos (Lobby, PainelJogador)
 * 3) persistência (localStorage)
 * 4) efeitos (useEffect) para hidratar e gravar
 * 5) funções de negócio (rolar, resetar)
 */

import { useEffect, useRef, useState } from 'react';
import ConfirmacaoRestart from './ConfirmacaoRestart';
import GuiaJogo from './GuiaJogo';
import HudComandos from './HudComandos';
import Lobby from './Lobby';
import MenuApp from './MenuApp';
import PainelJogador from './PainelJogador';
import { useTelaCheia } from '../hooks/useTelaCheia';
import {
  DURACAO_ROLAGEM,
  PAUSA_RESULTADO,
  estadoInicial,
  rolarDado,
  resultadoPartida,
  resultadoRodada,
  somaDados,
  TOTAL_RODADAS,
} from '../lib/regras';
import { gravarPrefs, lerPrefs } from '../lib/prefs';
import { gravarSave, lerSave, limparSave, savePadrao } from '../lib/storage';
import { definirSom, tocarPouso, tocarResultado, tocarRolagem } from '../lib/som';

export default function JogoDados() {
  const [tela, setTela] = useState('lobby');
  const [perfil, setPerfil] = useState(() => savePadrao().perfil);
  const [estatisticas, setEstatisticas] = useState(() => savePadrao().estatisticas);
  const [partidaSalva, setPartidaSalva] = useState(null);
  const [estado, setEstado] = useState(() => estadoInicial(savePadrao().perfil));
  const [hidratado, setHidratado] = useState(false);
  const [pedirReset, setPedirReset] = useState(false);
  const [pedirAjuda, setPedirAjuda] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [somLigado, setSomLigado] = useState(true);
  const timeoutRef = useRef(null);
  const { ativa: telaCheia, alternar: alternarTelaCheia } = useTelaCheia();

  const {
    rodada,
    turno,
    dados1,
    dados2,
    lance1,
    lance2,
    nomes,
    temas,
    mensagem,
    placar,
    historico,
    rolando,
    revelando,
    jogoFinalizado,
    mensagemFinal,
  } = estado;

  // Hidratação: lê o localStorage só depois do 1º render (evita mismatch SSR).
  useEffect(() => {
    const save = lerSave();
    const prefs = lerPrefs();
    setPerfil(save.perfil);
    setEstatisticas(save.estatisticas);
    setPartidaSalva(save.partida);
    setSomLigado(prefs.somLigado);
    definirSom(prefs.somLigado);
    if (!prefs.guiaVisto) setPedirAjuda(true);
    setHidratado(true);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function fecharGuia() {
    setPedirAjuda(false);
    gravarPrefs({ guiaVisto: true });
  }

  function alternarSom() {
    setSomLigado((atual) => {
      const proximo = !atual;
      definirSom(proximo);
      gravarPrefs({ somLigado: proximo });
      return proximo;
    });
  }

  // Sempre que o estado muda, grava — menos no meio da rolagem.
  useEffect(() => {
    if (!hidratado) return;
    gravarSave({
      perfil,
      estatisticas,
      partida:
        tela === 'mesa' && !estado.rolando && !estado.revelando && !estado.jogoFinalizado
          ? estado
          : partidaSalva,
    });
  }, [perfil, estatisticas, estado, tela, partidaSalva, hidratado]);

  function alterarJogador(lado, patch) {
    setPerfil((atual) => ({
      ...atual,
      [lado]: { ...atual[lado], ...patch },
    }));
  }

  function entrarNaMesa() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const nova = estadoInicial(perfil);
    setEstado(nova);
    setPartidaSalva(nova);
    setTela('mesa');
  }

  function continuarPartida() {
    if (!partidaSalva) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setEstado({ ...partidaSalva, rolando: false });
    setTela('mesa');
  }

  function voltarAoLobby() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (jogoFinalizado) setPartidaSalva(null);
    else setPartidaSalva({ ...estado, rolando: false });
    setTela('lobby');
  }

  function encerrarPartida(novoPlacar) {
    setEstatisticas((atual) => {
      const proximo = {
        ...atual,
        partidas: atual.partidas + 1,
      };
      if (novoPlacar.jogador1 > novoPlacar.jogador2) proximo.vitorias1 += 1;
      else if (novoPlacar.jogador2 > novoPlacar.jogador1) proximo.vitorias2 += 1;
      else proximo.empates += 1;
      return proximo;
    });
    setPartidaSalva(null);
  }

  /** Zera React + localStorage. Próxima dupla começa limpa. */
  function resetarTudo() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    limparSave();
    const padrao = savePadrao();
    setPerfil(padrao.perfil);
    setEstatisticas(padrao.estatisticas);
    setPartidaSalva(null);
    setEstado(estadoInicial(padrao.perfil));
    setTela('lobby');
    setPedirReset(false);
  }

  function jogarJogador1() {
    if (
      tela !== 'mesa' ||
      jogoFinalizado ||
      historico.length >= TOTAL_RODADAS ||
      turno !== 'jogador1' ||
      rolando ||
      revelando
    ) {
      return;
    }

    tocarRolagem();
    const novosDados1 = [rolarDado(), rolarDado()];

    setEstado((atual) => ({
      ...atual,
      dados1: novosDados1,
      dados2: [null, null],
      lance1: atual.lance1 + 1,
      rolando: true,
      revelando: false,
      mensagem: 'Os dados estão rolando...',
      rodadaConcluida: false,
    }));

    timeoutRef.current = setTimeout(() => {
      tocarPouso();
      const soma = somaDados(novosDados1);
      setEstado((atual) => ({
        ...atual,
        rolando: false,
        revelando: true,
        mensagem: `${atual.nomes.jogador1} tirou ${soma}.`,
      }));

      timeoutRef.current = setTimeout(() => {
        setEstado((atual) => ({
          ...atual,
          revelando: false,
          turno: 'jogador2',
          mensagem: `${atual.nomes.jogador2}, lance os dados.`,
        }));
      }, PAUSA_RESULTADO);
    }, DURACAO_ROLAGEM);
  }

  function jogarJogador2() {
    if (
      tela !== 'mesa' ||
      jogoFinalizado ||
      historico.length >= TOTAL_RODADAS ||
      turno !== 'jogador2' ||
      rolando ||
      revelando
    ) {
      return;
    }

    tocarRolagem();
    const novosDados2 = [rolarDado(), rolarDado()];

    setEstado((atual) => ({
      ...atual,
      dados2: novosDados2,
      lance2: atual.lance2 + 1,
      rolando: true,
      revelando: false,
      mensagem: 'Os dados estão rolando...',
    }));

    timeoutRef.current = setTimeout(() => {
      tocarPouso();
      let placarFinal = null;
      let tipoSom = null;

      setEstado((atual) => {
        const soma1 = somaDados(atual.dados1);
        const soma2 = somaDados(novosDados2);
        const novoPlacar = { ...atual.placar };
        let vencedor = 'empate';

        if (soma1 > soma2) {
          vencedor = 'jogador1';
          novoPlacar.jogador1 += 1;
        } else if (soma2 > soma1) {
          vencedor = 'jogador2';
          novoPlacar.jogador2 += 1;
        } else {
          novoPlacar.empates += 1;
        }

        const textoRodada = resultadoRodada(vencedor);
        const ehUltimaRodada = atual.rodada === TOTAL_RODADAS;
        let mensagemFinal = '';
        if (ehUltimaRodada) {
          mensagemFinal = resultadoPartida(novoPlacar);
          placarFinal = novoPlacar;
          tipoSom = novoPlacar.jogador1 === novoPlacar.jogador2 ? 'empate' : 'vitoria';
        }

        return {
          ...atual,
          dados2: novosDados2,
          placar: novoPlacar,
          historico: [
            ...atual.historico,
            { rodada: atual.rodada, soma1, soma2, vencedor },
          ],
          mensagem: textoRodada,
          rolando: false,
          revelando: !ehUltimaRodada,
          rodadaConcluida: true,
          jogoFinalizado: ehUltimaRodada,
          mensagemFinal,
        };
      });

      if (tipoSom) tocarResultado(tipoSom);
      if (placarFinal) encerrarPartida(placarFinal);

      timeoutRef.current = setTimeout(() => {
        setEstado((atual) => {
          if (atual.jogoFinalizado || atual.historico.length >= TOTAL_RODADAS) {
            return { ...atual, revelando: false };
          }
          return {
            ...atual,
            revelando: false,
            turno: 'jogador1',
            rodada: Math.min(atual.rodada + 1, TOTAL_RODADAS),
          };
        });
      }, PAUSA_RESULTADO);
    }, DURACAO_ROLAGEM);
  }

  function jogarNovamente() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const nova = estadoInicial(perfil);
    setEstado(nova);
    setPartidaSalva(nova);
  }

  // Atalhos estilo jogo de PC. Ignora quando o foco está em um input.
  useEffect(() => {
    function onKey(event) {
      const tag = event.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if ((event.key === 'f' || event.key === 'F') && !event.metaKey && !event.ctrlKey && !event.altKey) {
        if (event.repeat) return;
        event.preventDefault();
        alternarTelaCheia();
        return;
      }

      if (event.key === 'r' || event.key === 'R') {
        if (!event.shiftKey) return;
        event.preventDefault();
        setPedirReset(true);
        return;
      }

      if (event.key === '?' || event.key === 'h' || event.key === 'H') {
        if (event.metaKey || event.ctrlKey) return;
        event.preventDefault();
        setPedirAjuda(true);
        return;
      }

      if ((event.key === 'm' || event.key === 'M') && !event.metaKey && !event.ctrlKey) {
        if (event.repeat) return;
        event.preventDefault();
        alternarSom();
        return;
      }

      if (event.key === 'Escape') {
        if (menuAberto) {
          setMenuAberto(false);
          return;
        }
        if (pedirAjuda) {
          fecharGuia();
          return;
        }
        if (pedirReset) {
          setPedirReset(false);
          return;
        }
        if (tela === 'mesa') voltarAoLobby();
        return;
      }

      if (pedirAjuda || pedirReset) return;
      if (event.code !== 'Space' && event.key !== ' ') return;
      if (event.repeat) return;
      if (tela !== 'mesa') return;
      event.preventDefault();
      if (revelando || rolando) return;
      if (jogoFinalizado) {
        jogarNovamente();
        return;
      }
      if (turno === 'jogador1') jogarJogador1();
      else jogarJogador2();
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [jogoFinalizado, turno, rolando, revelando, tela, pedirReset, pedirAjuda, menuAberto, alternarTelaCheia]);

  const soma1 = !rolando || turno === 'jogador2' ? somaDados(dados1) : null;
  const soma2 = !rolando ? somaDados(dados2) : null;
  const p1Ativo = !jogoFinalizado && turno === 'jogador1' && !rolando && !revelando;
  const p2Ativo = !jogoFinalizado && turno === 'jogador2' && !rolando && !revelando;

  if (!hidratado) {
    return (
      <div className="plataforma">
        <div className="jogo-card">
          <p className="lobby-sub">Carregando sala...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="plataforma">
      <MenuApp
        aberto={menuAberto}
        onAberto={setMenuAberto}
        somLigado={somLigado}
        telaCheia={telaCheia}
        onComoJogar={() => setPedirAjuda(true)}
        onSom={alternarSom}
        onTelaCheia={alternarTelaCheia}
        onResetar={() => setPedirReset(true)}
      />

      <div className="jogo-card">
        {tela === 'lobby' ? (
          <Lobby
            perfil={perfil}
            estatisticas={estatisticas}
            partidaSalva={partidaSalva}
            onChangeJogador={alterarJogador}
            onEntrar={entrarNaMesa}
            onContinuar={continuarPartida}
          />
        ) : (
          <>
            {jogoFinalizado ? <Confete /> : null}

            <div className={`mesa-duelo ${rolando ? 'tremendo' : ''} ${jogoFinalizado ? 'acabou' : ''}`}>
              <header className="mesa-barra">
                <button className="botao-texto" type="button" onClick={voltarAoLobby}>
                  ← Sala
                </button>
                <div className="mesa-barra-meio">
                  <p className="jogo-kicker">5 rodadas · os dois jogam em cada uma</p>
                  <p className="jogo-rodada">
                    Rodada {rodada} de {TOTAL_RODADAS}
                  </p>
                  <ol className="rodadas-tracker" aria-label="Progresso das rodadas">
                    {Array.from({ length: TOTAL_RODADAS }, (_, i) => {
                      const registro = historico[i];
                      const atual = !registro && i === historico.length && !jogoFinalizado;
                      return (
                        <li
                          key={i}
                          className={`rodada-pip ${registro ? `feita ${registro.vencedor}` : ''} ${atual ? 'atual' : ''}`}
                        >
                          <span className="sr-only">
                            {registro
                              ? `Rodada ${i + 1}: ${resultadoRodada(registro.vencedor)}`
                              : atual
                                ? `Rodada ${i + 1} em andamento`
                                : `Rodada ${i + 1} pendente`}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                </div>
                <div className="placar placar-inline" aria-label="Placar">
                  <div className="placar-item p1">
                    <span>{nomes.jogador1}</span>
                    <strong>{placar.jogador1}</strong>
                  </div>
                  <div className="placar-item emp">
                    <span>Emp.</span>
                    <strong>{placar.empates}</strong>
                  </div>
                  <div className="placar-item p2">
                    <span>{nomes.jogador2}</span>
                    <strong>{placar.jogador2}</strong>
                  </div>
                </div>
              </header>

              <p className={`mesa-status mesa-status-linha ${jogoFinalizado ? 'final' : ''}`} aria-live="polite">
                {jogoFinalizado ? mensagemFinal : mensagem}
              </p>

              <div className="mesa-moldura">
                <div className="mesa">
                  <div className={`jogadores ${jogoFinalizado ? 'final' : `turno-${turno}`}`}>
                    <PainelJogador
                      lado="p1"
                      nome={nomes.jogador1}
                      tema={temas.jogador1}
                      dados={dados1}
                      lance={lance1}
                      soma={soma1}
                      ativo={p1Ativo}
                      noPalco={jogoFinalizado || turno === 'jogador1'}
                      rolando={rolando && turno === 'jogador1'}
                      encerrado={jogoFinalizado}
                      disabled={jogoFinalizado || turno !== 'jogador1' || rolando || revelando}
                      onJogar={jogarJogador1}
                    />

                    <PainelJogador
                      lado="p2"
                      nome={nomes.jogador2}
                      tema={temas.jogador2}
                      dados={dados2}
                      lance={lance2}
                      soma={soma2}
                      ativo={p2Ativo}
                      noPalco={jogoFinalizado || turno === 'jogador2'}
                      rolando={rolando && turno === 'jogador2'}
                      encerrado={jogoFinalizado}
                      disabled={jogoFinalizado || turno !== 'jogador2' || rolando || revelando}
                      onJogar={jogarJogador2}
                    />
                  </div>
                </div>
              </div>

              {historico.length > 0 ? (
                <ul className="historico historico-trilho" aria-label="Histórico das rodadas">
                  {historico.map((item) => (
                    <li key={item.rodada} className={item.vencedor}>
                      <span>R{item.rodada}</span>
                      {item.soma1}–{item.soma2}
                      <em>{resultadoRodada(item.vencedor)}</em>
                    </li>
                  ))}
                </ul>
              ) : null}

              {jogoFinalizado ? (
                <div className="lobby-acoes mesa-fim">
                  <button className="botao-reiniciar" type="button" onClick={jogarNovamente}>
                    Jogar Novamente
                  </button>
                  <button className="botao-secundario" type="button" onClick={voltarAoLobby}>
                    Trocar nomes e temas
                  </button>
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>

      <HudComandos naMesa={tela === 'mesa'} />

      <GuiaJogo aberto={pedirAjuda} onFechar={fecharGuia} />

      <ConfirmacaoRestart
        aberto={pedirReset}
        onCancelar={() => setPedirReset(false)}
        onConfirmar={resetarTudo}
      />
    </div>
  );
}

function Confete() {
  return (
    <div className="confete" aria-hidden="true">
      {Array.from({ length: 36 }, (_, i) => (
        <i
          key={i}
          style={{
            left: `${(i * 2.7) % 100}%`,
            animationDelay: `${(i % 12) * 0.08}s`,
            animationDuration: `${2.2 + (i % 5) * 0.25}s`,
            background: i % 3 === 0 ? '#00fff2' : i % 3 === 1 ? '#ff2bd6' : '#f0d78c',
          }}
        />
      ))}
    </div>
  );
}
