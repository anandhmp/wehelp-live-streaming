import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span>© 2026 — All Rights Reserved</span>
        <span className={styles.gold}>Secure Investor Live View</span>
      </div>
    </footer>
  );
}