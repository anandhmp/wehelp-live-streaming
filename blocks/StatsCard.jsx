import styles from './StatsCard.module.scss';
import Icon from '../components/Icon';

export default function StatsCard() {
  return (
    <>
      <div className={`${styles.label} reveal d5`}>
        <span>AT A GLANCE</span>
        <h2>Live Stream Information</h2>
      </div>
      <div className={`${styles.card} reveal d5`}>
        <div className={styles.stat}>
          <div className={styles.ico}>
            <Icon name="camera" size={24} strokeWidth={1.8} />
          </div>
          <div>
            <div className={styles.k}>CAMERA</div>
            <div className={styles.v}>Dining Area</div>
          </div>
        </div>
        <div className={styles.stat}>
          <div className={styles.ico}>
            <Icon name="signal" size={24} strokeWidth={1.8} />
          </div>
          <div>
            <div className={styles.k}>STATUS</div>
            <div className={styles.v}>
              <span className={styles.dot} />
              Live
            </div>
          </div>
        </div>
        <div className={styles.stat}>
          <div className={styles.ico}>
            <Icon name="shield" size={24} strokeWidth={1.8} />
          </div>
          <div>
            <div className={styles.k}>ACCESS</div>
            <div className={styles.v}>Authorized View</div>
          </div>
        </div>
      </div>
    </>
  );
}