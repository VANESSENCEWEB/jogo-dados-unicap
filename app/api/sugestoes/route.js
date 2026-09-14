/**
 * Route Handler do Next.js (App Router).
 *
 * GET /api/sugestoes
 *
 * O cliente chama com fetch(). Aqui no servidor tentamos uma API pública
 * (randomuser.me). Se a faculdade estiver sem internet, caímos na lista
 * local — o jogo nunca quebra.
 *
 * export async function GET = a função HTTP que o Next reconhece.
 */

const NICKS_FALLBACK = [
  'Nova', 'Hex', 'Rook', 'Luna', 'Blitz', 'Kira', 'Echo', 'Vex', 'Nox', 'Pixel',
];

function nickAleatorioLocal() {
  const indice = Math.floor(Math.random() * NICKS_FALLBACK.length);
  return NICKS_FALLBACK[indice];
}

export async function GET() {
  try {
    const resposta = await fetch('https://randomuser.me/api/?nat=br', {
      cache: 'no-store',
    });

    if (!resposta.ok) {
      throw new Error('API externa indisponível');
    }

    const dados = await resposta.json();
    const primeiro = dados?.results?.[0]?.name?.first || nickAleatorioLocal();

    return Response.json({
      nick: String(primeiro).slice(0, 16),
      fonte: 'randomuser',
    });
  } catch {
    return Response.json({
      nick: nickAleatorioLocal(),
      fonte: 'fallback',
    });
  }
}
