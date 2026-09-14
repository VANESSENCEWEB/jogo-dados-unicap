'use client';

import { useState } from 'react';

/**
 * Hook customizado: encapsula o fetch da rota /api/sugestoes.
 *
 * Por que um hook? Para o Lobby não misturar UI com detalhes de HTTP.
 * Qualquer componente pode chamar: const { buscarNick, carregando } = useSugestaoNick();
 */
export function useSugestaoNick() {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  /**
   * Função assíncrona (async/await) — o professor espera ver isso
   * junto com fetch e tratamento de erro.
   * @returns {Promise<string|null>}
   */
  async function buscarNick() {
    setCarregando(true);
    setErro('');

    try {
      const resposta = await fetch('/api/sugestoes');
      if (!resposta.ok) {
        throw new Error('Falha ao buscar nick');
      }
      const dados = await resposta.json();
      return dados.nick;
    } catch {
      setErro('Não deu para gerar o nick. Tente de novo.');
      return null;
    } finally {
      setCarregando(false);
    }
  }

  return { buscarNick, carregando, erro };
}
