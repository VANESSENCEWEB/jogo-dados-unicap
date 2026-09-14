/**
 * Persistência no navegador (Web Storage API).
 *
 * O professor costuma perguntar: "onde o dado vive se eu der F5?"
 * Resposta: no localStorage, uma chave JSON neste domínio. Não é banco
 * de dados — some se a pessoa limpar o site ou clicar em Resetar.
 *
 * Export nomeado: cada função é importada pelo nome, não por default.
 */

const CHAVE = 'jogo-dados-save-v1';

const PADRAO = {
  perfil: {
    jogador1: { nome: '', tema: 'neon' },
    jogador2: { nome: '', tema: 'plasma' },
  },
  estatisticas: {
    partidas: 0,
    vitorias1: 0,
    vitorias2: 0,
    empates: 0,
  },
  partida: null,
};

/** Cópia nova do estado vazio (evita mutar o objeto PADRAO). */
export function savePadrao() {
  return JSON.parse(JSON.stringify(PADRAO));
}

/** Lê o save. No servidor (SSR) não existe window, então devolve o padrão. */
export function lerSave() {
  if (typeof window === 'undefined') return savePadrao();

  try {
    const bruto = window.localStorage.getItem(CHAVE);
    if (!bruto) return savePadrao();
    const parsed = JSON.parse(bruto);
    return {
      perfil: {
        jogador1: { ...PADRAO.perfil.jogador1, ...parsed?.perfil?.jogador1 },
        jogador2: { ...PADRAO.perfil.jogador2, ...parsed?.perfil?.jogador2 },
      },
      estatisticas: { ...PADRAO.estatisticas, ...parsed?.estatisticas },
      partida: parsed?.partida ?? null,
    };
  } catch {
    return savePadrao();
  }
}

/** Mescla um pedaço do save com o que já estava gravado. */
export function gravarSave(patch) {
  if (typeof window === 'undefined') return;
  const atual = lerSave();
  window.localStorage.setItem(
    CHAVE,
    JSON.stringify({
      ...atual,
      ...patch,
      perfil: patch.perfil ?? atual.perfil,
      estatisticas: patch.estatisticas ?? atual.estatisticas,
      partida: patch.partida === undefined ? atual.partida : patch.partida,
    }),
  );
}

/**
 * Apaga a chave inteira. Usado pelo botão Resetar para novos jogadores
 * começarem com nomes, temas e placar zerados.
 */
export function limparSave() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(CHAVE);
}
