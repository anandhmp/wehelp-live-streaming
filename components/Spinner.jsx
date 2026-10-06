import styles from './Spinner.module.scss';

export default function Spinner({ size = 22 }) {
  return <span className={styles.spinner} style={{ width: size, height: size }} />;
}