// Hoje - Dia 2 isso é só visual - A lógica de sortear dado de verdade farei amanha.
// Por hoje, os valores dos dados ficam fixos (null = ainda não jogou) só pra ver o layout:
// Só um botão habilitado por vez, o botão do Jogador 2 já está disabled 
// 'use client' porque esse componente vai ter clique de botão (interação).
'use client';

import { useState } from 'react';
import Dado from './Dado';

export default function JogoDados() {
  const [dadosJogador1] = useState([null, null]);
  const [dadosJogador2] = useState([null, null]);

  return (
    <main className="jogo">
      <h1>Jogo de Dados</h1>
      <p className="rodada">Rodada 1 de 5</p>

      <div className="jogadores">
        <section className="jogador">
          <h2>Jogador 1</h2>
          <div className="dados">
            <Dado valor={dadosJogador1[0]} />
            <Dado valor={dadosJogador1[1]} />
          </div>
          <button>Jogar</button>
        </section>

        <section className="jogador">
          <h2>Jogador 2</h2>
          <div className="dados">
            <Dado valor={dadosJogador2[0]} />
            <Dado valor={dadosJogador2[1]} />
          </div>
          <button disabled>Jogar</button>
        </section>
      </div>

      <p className="resultado">Aguardando jogadas...</p>
    </main>
  );
}