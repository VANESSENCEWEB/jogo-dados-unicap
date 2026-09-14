/**
 * Preferências do visitante (guia visto + som).
 * Ficam numa chave separada do save da partida: Resetar o jogo
 * não apaga "já vi o tutorial" nem o mute.
 */

const CHAVE = 'jogo-dados-prefs-v1';

const PADRAO = {
  guiaVisto: false,
  somLigado: true,
};

export function prefsPadrao() {
  return { ...PADRAO };
}

export function lerPrefs() {
  if (typeof window === 'undefined') return prefsPadrao();

  try {
    const bruto = window.localStorage.getItem(CHAVE);
    if (!bruto) return prefsPadrao();
    return { ...PADRAO, ...JSON.parse(bruto) };
  } catch {
    return prefsPadrao();
  }
}

export function gravarPrefs(patch) {
  if (typeof window === 'undefined') return prefsPadrao();
  const proximo = { ...lerPrefs(), ...patch };
  window.localStorage.setItem(CHAVE, JSON.stringify(proximo));
  return proximo;
}
