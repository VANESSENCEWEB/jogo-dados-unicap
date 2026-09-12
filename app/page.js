import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.home}>
      <h1>Jogo de Dados</h1>

      <h2 className={styles.dados} aria-hidden="true">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>
            🎲
          </span>
        ))}
      </h2>

      <p className={styles.construction}> || 🚧 Em construção... 🏗️ || </p>

      <p> -__-__-__-__-__-__-__-__-__-__-__-__-__-__-__-__-__-__-__-__-__-</p>

      <p className={styles.soon}>✨✨ Wait! Coming Soon ...</p>

    </main>
  );
}
