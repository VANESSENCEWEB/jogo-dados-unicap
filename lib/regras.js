// lib/regras.js — as regras do jogo, sem nenhuma linha de React/DOM aqui dentro.

export const TOTAL_RODADAS = 5;

// Sorteia um número de 1 a 6, como um dado de verdade.
export function rolarDado() {
  return Math.floor(Math.random() * 6) + 1;
}

// Soma os dois dados de um jogador.
export function somaDados([d1, d2]) {
  return d1 + d2;
}

// Decide quem venceu A RODADA comparando as duas somas.
export function resultadoRodada(soma1, soma2) {
  if (soma1 > soma2) return 'jogador1';
  if (soma2 > soma1) return 'jogador2';
  return 'empate';
}

// Transforma o resultado em texto pra mostrar na tela.
export function textoResultadoRodada(vencedor) {
  if (vencedor === 'jogador1') return 'Jogador 1 venceu';
  if (vencedor === 'jogador2') return 'Jogador 2 venceu';
  return 'Empate';
}
