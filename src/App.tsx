import styles from './App.module.css'

export default function App(): React.JSX.Element {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>Vercel + Vite + React</span>
          <h1 className={styles.title}>Your app starts here</h1>
          <p className={styles.subtitle}>
            Built with React 19, TypeScript, Vite, and deployed on Vercel.
            Describe what you want to build and the agent will take it from here.
          </p>
        </section>

        <div className={styles.grid}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Getting started</h2>
            <p className={styles.cardText}>
              This is your starter canvas. The agent will replace this content
              with your actual application based on your description.
            </p>
            <div className={styles.actions}>
              <button className={styles.button} type="button">
                Get started
              </button>
            </div>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Deploy to Vercel</h2>
            <p className={styles.cardText}>
              Run <code className={styles.code}>vercel deploy</code> to publish
              a preview URL, or push to your main branch for a production
              deployment.
            </p>
            <div className={styles.actions}>
              <button className={styles.buttonOutline} type="button">
                View docs
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
