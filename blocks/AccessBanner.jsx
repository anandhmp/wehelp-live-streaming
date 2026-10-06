import styles from './AccessBanner.module.scss';
import Icon from '../components/Icon';

export default function AccessBanner() {
  return (
    <div className={styles.access}>
      <div className={styles.orn}>
        <i />
        <Icon name="diamond" size={8} />
        <i />
      </div>
      <div className={styles.badge}>
        <Icon name="lock" size={16} strokeWidth={2.2} />
        Authorized Investor Access
      </div>
      <small>Access may be restricted or revoked by the facility administrator.</small>
    </div>
  );
}