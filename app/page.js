/**
 * page.js — rota "/" (App Router).
 * Server Component: só monta o jogo. A interatividade vive em JogoDados.
 */
import JogoDados from '../components/JogoDados';

export default function Home() {
  return (
    <main className="pagina">
      <JogoDados />
    </main>
  );
}
