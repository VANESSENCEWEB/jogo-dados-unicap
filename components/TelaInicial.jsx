'use client';

/**
 * Tela de abertura (title screen), antes da sala.
 * Mostra o que é o jogo em poucos segundos: título, regra em uma frase
 * e um "duelo" de exemplo com as skins escolhidas por cada jogador.
 * Não tem lógica de jogo — só chama as funções que vêm do JogoDados.
 */

import { TEMAS, nomeJogador } from '../lib/temas';

// Duelo ilustrativo: valores fixos, só para mostrar como a mesa funciona.
const EXEMPLO = {
  jogador1: [6, 5],
  jogador2: [4, 3],
};

const FATOS = [
  { valor: '5', rotulo: 'rodadas' },
  { valor: '4', rotulo: 'skins de dado' },
  { valor: '2', rotulo: 'jogadores, 1 tela' },
  { valor: 'Auto', rotulo: 'save no navegador' },
];

function corDoTema(id) {
  return (TEMAS.find((tema) => tema.id === id) || TEMAS[0]).cor;
}

function LadoDuelo({ lado, jogador, fallback, dados }) {
  const soma = dados[0] + dados[1];
  return (
    <div className={`inicio-lado ${lado}`} style={{ '--cor-jogador': corDoTema(jogador.tema) }}>
      <div className="inicio-dados">
        {dados.map((valor, i) => (
          <img
            key={i}
            className={`inicio-dado tema-${jogador.tema}`}
            src={`/dados/${valor}.svg`}
            alt=""
            width={128}
            height={128}
            draggable={false}
          />
        ))}
      </div>
      <p className="inicio-soma">{soma}</p>
      <p className="inicio-nome">{nomeJogador(jogador.nome, fallback)}</p>
    </div>
  );
}

export default function TelaInicial({ perfil, partidaSalva, onJogar, onContinuar, onComoJogar }) {
  return (
    <section className="inicio" aria-labelledby="inicio-titulo">
      <div className="inicio-hero">
        <div className="inicio-texto">
          <p className="inicio-selo">
            <i aria-hidden="true" />
            Duelo local · 2 jogadores
          </p>

          <h1 className="inicio-titulo" id="inicio-titulo">
            <span className="j">Jogue</span>
            <span className="d">Dados</span>
          </h1>

          <p className="inicio-lead">
            Duas pessoas, um aparelho, <b>cinco rodadas</b>. Cada um rola dois dados — a{' '}
            <b>maior soma</b> leva o ponto. Sem conta, sem cadastro: o progresso fica salvo no
            navegador.
          </p>

          <div className="inicio-ctas">
            <button className="inicio-cta" type="button" onClick={onJogar}>
              Jogar agora →
            </button>
            {partidaSalva ? (
              <button className="inicio-cta-2" type="button" onClick={onContinuar}>
                Continuar partida
              </button>
            ) : null}
            <button className="inicio-cta-2" type="button" onClick={onComoJogar}>
              Como jogar
            </button>
          </div>
        </div>

        <div className="inicio-duelo" aria-hidden="true">
          <LadoDuelo lado="p1" jogador={perfil.jogador1} fallback="Jogador 1" dados={EXEMPLO.jogador1} />
          <div className="inicio-vs">VS</div>
          <LadoDuelo lado="p2" jogador={perfil.jogador2} fallback="Jogador 2" dados={EXEMPLO.jogador2} />
          <p className="inicio-placa">Rodada 3 de 5 · ponto do Jogador 1</p>
        </div>
      </div>

      <dl className="inicio-fatos">
        {FATOS.map((fato) => (
          <div key={fato.rotulo} className="inicio-fato">
            <dt className="sr-only">{fato.rotulo}</dt>
            <dd>
              <b>{fato.valor}</b>
              <span aria-hidden="true">{fato.rotulo}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
