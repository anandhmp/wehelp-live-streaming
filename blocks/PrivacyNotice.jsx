import styles from './PrivacyNotice.module.scss';
import Icon from '../components/Icon';

export default function PrivacyNotice() {
  return (
    <div className={styles.notice}>
      <div className={styles.head}>
        <div className={styles.ico}>
          <Icon name="lock" size={22} strokeWidth={1.9} />
        </div>
        <h3>Privacy &amp; Access</h3>
      </div>
      <p>
        This live view is provided exclusively for authorized investors and
        stakeholders. The camera is positioned to show the Dining Area only.
        Private rooms and other restricted areas are not included in this
        stream.
      </p>
    </div>
  );
}