import styles from './Hero.module.scss';
import Icon from '../components/Icon';

export default function Hero() {
  return (
    <div className={styles.topZone}>
      <section className={styles.hero}>
        <span className={`${styles.eyebrow} reveal d1`}>LIVE FACILITY VIEW</span>
        <h1 className={`${styles.title} reveal d2`}>
          Dining Area <span className={styles.em}>— Live View</span>
        </h1>
        <p className={`${styles.lead} reveal d3`}>
          A real-time view of our dining facility, provided for authorized
          investors and stakeholders.
        </p>
        <div className={`${styles.privacyLine} reveal d4`}>
          <Icon name="shieldCheck" size={18} strokeWidth={1.8} />
          <span>
            This live stream is limited to the Dining Area. Other private areas
            are not accessible through this link.
          </span>
        </div>
      </section>
    </div>
  );
}