'use client';

import { useState } from 'react';
import Dado from './Dado';
import {
  TOTAL_RODADAS,
  rolarDado,
  somaDados,
  resultadoRodada,
  textoResultadoRodada,
} from '../lib/regras';

export default function JogoDados() {
  const [rodada, setRodada] = useState(1);
  const [turno, setTurno] = useState('jogador1');
  const [dados1, setDados1] = useState([null, null]);
  const [dados2, setDados2] = useState([null, null]);
  const [mensagem, setMensagem] = useState('Jogador 1, jogue os dados.');
  const [placar, setPlacar] = useState({ jogador1: 0, jogador2: 0, empates: 0 });

  function jogar(jogador) {
    const novosDados = [rolarDado(), rolarDado()];

    if (jogador === 'jogador1') {
      setDados1(novosDados);
      setTurno('jogador2');
      setMensagem('Jogador 2, jogue os dados.');
      return;
    }

    setDados2(novosDados);

    const soma1 = somaDados(dados1);
    const soma2 = somaDados(novosDados);
    const vencedor = resultadoRodada(soma1, soma2);

    setPlacar((atual) => ({
      jogador1: atual.jogador1 + (vencedor === 'jogador1' ? 1 : 0),
      jogador2: atual.jogador2 + (vencedor === 'jogador2' ? 1 : 0),
      empates: atual.empates + (vencedor === 'empate' ? 1 : 0),
    }));

    setMensagem(textoResultadoRodada(vencedor));

    setTimeout(() => {
      setRodada((r) => r + 1);
      setDados1([null, null]);
      setDados2([null, null]);
      setTurno('jogador1');
      setMensagem('Jogador 1, jogue os dados.');
    }, 1500);
  }

  return (
    <main className="jogo">
      <h1>Jogo de Dados</h1>
      <p className="rodada">
        Rodada {rodada} de {TOTAL_RODADAS}
      </p>

      <div className="jogadores">
        <section className="jogador">
          <h2>Jogador 1</h2>
          <div className="dados">
            <Dado valor={dados1[0]} />
            <Dado valor={dados1[1]} />
          </div>
          <button
            onClick={() => jogar('jogador1')}
            disabled={turno !== 'jogador1'}
          >
            Jogar
          </button>
        </section>

        <section className="jogador">
          <h2>Jogador 2</h2>
          <div className="dados">
            <Dado valor={dados2[0]} />
            <Dado valor={dados2[1]} />
          </div>
          <button
            onClick={() => jogar('jogador2')}
            disabled={turno !== 'jogador2'}
          >
            Jogar
          </button>
        </section>
      </div>

      <p className="resultado">{mensagem}</p>
      <p className="placar">
        Placar — Jogador 1: {placar.jogador1} | Jogador 2: {placar.jogador2} | Empates:{' '}
        {placar.empates}
      </p>
    </main>
  );
}