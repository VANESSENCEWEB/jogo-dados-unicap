/**
 * Regras puras do jogo (sem React).
 *
 * Separar a lógica da interface é uma prática atual: fica mais fácil
 * testar, reler e explicar. Estas funções só recebem dados e devolvem
 * dados — não mexem em tela, som nem localStorage.
 */

import { nomeJogador } from './temas';

/** Quantas rodadas tem uma partida. */
export const TOTAL_RODADAS = 5;

/** Tempo (ms) da animação 3D antes de mostrar o resultado. */
export const DURACAO_ROLAGEM = 1400;

/** Tempo (ms) com o resultado grande no palco antes de passar a vez. */
export const PAUSA_RESULTADO = 1600;

/**
 * Sorteia um número de 1 a 6, como um dado físico.
 * Math.random() gera [0, 1); multiplicamos por 6 e arredondamos para baixo.
 */
export function rolarDado() {
  return Math.floor(Math.random() * 6) + 1;
}

/**
 * Soma os dois dados de um jogador.
 * Se ainda não jogou (null), devolve null para a UI mostrar "Aguardando".
 */
export function somaDados(dados) {
  if (dados[0] == null || dados[1] == null) return null;
  return dados[0] + dados[1];
}

/**
 * Monta o estado inicial de uma partida nova.
 * @param {{ jogador1: { nome: string, tema: string }, jogador2: { nome: string, tema: string } }} perfil
 */
export function estadoInicial(perfil) {
  const n1 = nomeJogador(perfil.jogador1.nome, 'Jogador 1');
  const n2 = nomeJogador(perfil.jogador2.nome, 'Jogador 2');

  return {
    rodada: 1,
    turno: 'jogador1',
    dados1: [null, null],
    dados2: [null, null],
    lance1: 0,
    lance2: 0,
    nomes: { jogador1: n1, jogador2: n2 },
    temas: { jogador1: perfil.jogador1.tema, jogador2: perfil.jogador2.tema },
    mensagem: `${n1}, lance os dados.`,
    placar: { jogador1: 0, jogador2: 0, empates: 0 },
    historico: [],
    rolando: false,
    revelando: false,
    rodadaConcluida: false,
    jogoFinalizado: false,
    mensagemFinal: '',
  };
}

/**
 * Texto curto para o histórico da rodada (nome ou Empate).
 */
export function rotuloVencedor(vencedor, nomes) {
  if (vencedor === 'jogador1') return nomes.jogador1;
  if (vencedor === 'jogador2') return nomes.jogador2;
  return 'Empate';
}

/**
 * Frases do resultado da rodada, na barra da mesa.
 */
export function resultadoRodada(vencedor) {
  if (vencedor === 'jogador1') return 'Jogador 1, Venceu!';
  if (vencedor === 'jogador2') return 'Jogador 2, Venceu!';
  return 'Empate!';
}

/**
 * Frases oficiais do enunciado para o fim da partida (5 rodadas).
 */
export function resultadoPartida(placar) {
  if (placar.jogador1 > placar.jogador2) return 'Jogador 1 venceu';
  if (placar.jogador2 > placar.jogador1) return 'Jogador 2 venceu';
  return 'Empate geral';
}

/**
 * Título no lugar de "Rodada X de 5", só quando a partida acaba.
 */
export function tituloFimPartida(placar) {
  if (placar.jogador1 > placar.jogador2) return 'Jogador 1, venceu o jogo!';
  if (placar.jogador2 > placar.jogador1) return 'Jogador 2, venceu o jogo!';
  return 'Empate Geral';
}
