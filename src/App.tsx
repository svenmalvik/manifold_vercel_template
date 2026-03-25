import styles from './App.module.css'

export default function App(): React.JSX.Element {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>Ready to go</span>
          <h1 className={styles.title}>Welcome to your app</h1>
          <p className={styles.subtitle}>
            This is your starting point. Tell Manifold what you'd like to build
            and it will create the app for you right here.
          </p>
        </section>

        <div className={styles.grid}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Your canvas</h2>
            <p className={styles.cardText}>
              This placeholder will be replaced with whatever you describe.
              A dashboard, a form, a portfolio — just say the word.
            </p>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Live on the web</h2>
            <p className={styles.cardText}>
              Your app will be published online automatically so you can share
              it with anyone via a link.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
