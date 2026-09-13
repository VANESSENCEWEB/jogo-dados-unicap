// Dado.jsx — só recebe um número (valor) e mostra a imagem certa.
// Componente Dado que recebe uma prop chamada valor... e exibe a imagem correspondente
// Se valor for null (ainda não jogou), mostra o dado "vazio".
export default function Dado({ valor }) {
  const imagem = valor ? `/dados/${valor}.svg` : '/dados/vazio.svg';

  return (
    <img
      src={imagem}
      alt={valor ? `Dado mostrando ${valor}` : 'Dado ainda não jogado'}
      width={80}
      height={80}
      className="dado"
    />
  );
}