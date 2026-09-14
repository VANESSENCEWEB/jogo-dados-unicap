'use client';

/**
 * Dado 3D em CSS (cubo com 6 faces).
 *
 * A inclinação "isométrica" fica num wrapper (.dado-inclinacao).
 * O cubo interno só gira em múltiplos de 90° — assim a face visível
 * é exatamente o `valor` (1–6), e a soma bate com o que a pessoa vê.
 *
 * Props:
 * - valor {1-6|null} face visível
 * - lance {number} muda a cada rolagem (mesmo valor 4→4 ainda anima)
 * - tema {string} classe CSS .tema-neon etc.
 * - rolando {boolean} pulo durante o giro
 * - estatico {boolean} preview do lobby, sem spin
 * - mini {boolean} cubo menor nos chips de skin / banco
 */

import { useEffect, useRef, useState } from 'react';

const FACES = [1, 2, 3, 4, 5, 6];

/** Rotação do cubo para trazer cada face para a câmera (sem tilt). */
const ROTACAO_FACE = {
  1: { x: 0, y: 0 },
  2: { x: -90, y: 0 },
  3: { x: 0, y: -90 },
  4: { x: 0, y: 90 },
  5: { x: 90, y: 0 },
  6: { x: 0, y: 180 },
};

const PIPS = {
  1: [5],
  2: [1, 9],
  3: [1, 5, 9],
  4: [1, 3, 7, 9],
  5: [1, 3, 5, 7, 9],
  6: [1, 3, 4, 6, 7, 9],
};

const IDLE = 'rotateX(0deg) rotateY(0deg)';

function transformAlvo(valor, extra = { x: 0, y: 0 }) {
  const alvo = ROTACAO_FACE[valor] || ROTACAO_FACE[1];
  return `rotateX(${extra.x + alvo.x}deg) rotateY(${extra.y + alvo.y}deg)`;
}

export default function Dado({
  valor,
  lance = 0,
  tema = 'neon',
  rolando = false,
  estatico = false,
  mini = false,
  pousou = false,
}) {
  const [transform, setTransform] = useState(IDLE);
  const giros = useRef({ x: 0, y: 0 });
  const ativo = Boolean(valor);

  useEffect(() => {
    if (!valor) {
      giros.current = { x: 0, y: 0 };
      setTransform(IDLE);
      return;
    }

    if (estatico) {
      setTransform(transformAlvo(valor));
      return;
    }

    const reduzirMovimento =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const extraX = reduzirMovimento ? 0 : 360 * (2 + Math.floor(Math.random() * 3));
    const extraY = reduzirMovimento ? 0 : 360 * (2 + Math.floor(Math.random() * 4));
    giros.current.x += extraX;
    giros.current.y += extraY;
    setTransform(transformAlvo(valor, giros.current));
  }, [valor, lance, estatico]);

  return (
    <div
      className={`dado tema-${tema} ${rolando ? 'rolando' : ''} ${ativo ? 'ativo' : 'vazio'} ${mini ? 'mini' : ''} ${estatico ? 'estatico' : ''} ${pousou ? 'pousou' : ''}`}
    >
      <div className="dado-palco">
        <div className="dado-inclinacao">
          <div
            className={`dado-cubo ${ativo ? '' : 'idle'}`}
            style={{ transform }}
            aria-hidden="true"
          >
            {FACES.map((face) => (
              <div key={face} className={`dado-face dado-face-${face}`}>
                {Array.from({ length: 9 }, (_, i) => {
                  const slot = i + 1;
                  const pip = PIPS[face].includes(slot);
                  return <span key={slot} className={pip ? 'pip' : 'pip-vazio'} />;
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      {mini ? null : <span className="dado-sombra" />}
      {valor && !rolando && !mini && !estatico ? (
        <span className="dado-valor" aria-hidden="true">{valor}</span>
      ) : null}
      <span className="sr-only">
        {valor ? `Dado com valor ${valor}` : 'Dado ainda não jogado'}
      </span>
    </div>
  );
}
