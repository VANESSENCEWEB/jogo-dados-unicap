/**
 * Catálogo de skins do dado.
 * export const = export nomeado de um array. O CSS usa o id: .dado.tema-neon
 */
export const TEMAS = [
  {
    id: 'neon',
    nome: 'Neon',
    cor: '#00fff2',
    descricao: 'Ciano elétrico — o brilho clássico da mesa.',
  },
  {
    id: 'plasma',
    nome: 'Pink',
    cor: '#ff2bd6',
    descricao: 'Magenta quente, com glow de letreiro.',
  },
  {
    id: 'classico',
    nome: 'Clássico',
    cor: '#efe4d2',
    descricao: 'Marfim de bar — o dado de sempre.',
  },
  {
    id: 'ouro',
    nome: 'Ouro',
    cor: '#e8c36a',
    descricao: 'Metal quente, face dourada.',
  },
];

/** Traduz o id da skin para o rótulo mostrado na mesa. */
export function nomeTema(id) {
  return TEMAS.find((tema) => tema.id === id)?.nome ?? 'Neon';
}

/** Se a pessoa não digitou nome, usamos o fallback (Jogador 1 / 2). */
export function nomeJogador(nome, fallback) {
  const limpo = (nome || '').trim();
  return limpo || fallback;
}
