'use client';

/**
 * Dado — recebe `valor` (1 a 6) e mostra a imagem correspondente.
 * É o que o enunciado pede: /dados/1.svg … /dados/6.svg, ou vazio.svg.
 */
export default function Dado({
  valor,
  tema = 'neon',
  rolando = false,
  estatico = false,
  mini = false,
  pousou = false,
}) {
  const imagem = valor ? `/dados/${valor}.svg` : '/dados/vazio.svg';
  const alt = valor ? `Dado mostrando ${valor}` : 'Dado ainda não jogado';

  return (
    <div
      className={`dado tema-${tema} ${rolando ? 'rolando' : ''} ${valor ? 'ativo' : 'vazio'} ${mini ? 'mini' : ''} ${estatico ? 'estatico' : ''} ${pousou ? 'pousou' : ''}`}
    >
      <img
        src={imagem}
        alt={alt}
        width={80}
        height={80}
        draggable={false}
      />
    </div>
  );
}
