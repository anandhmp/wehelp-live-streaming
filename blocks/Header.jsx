import { useEffect, useState } from 'react';
import styles from './Header.module.scss';
import Icon from '../components/Icon';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.mark} aria-hidden="true">
            <Icon name="home" size={20} color="#D4AF37" strokeWidth={1.8} />
          </div>
          <div>
            <div className={styles.name}>CARE FACILITY</div>
            <div className={styles.sub}>Investor Portal</div>
          </div>
        </div>
        <div className={styles.pill}>
          <Icon name="lock" size={14} strokeWidth={2.2} />
          Secure Live Access
        </div>
      </div>
    </header>
  );
}