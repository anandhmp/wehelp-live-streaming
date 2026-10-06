import styles from './Button.module.scss';

export default function Button({
  children,
  variant = 'default',
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  ariaLabel,
}) {
  const variantClass = styles[variant] || '';
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${styles.btn} ${variantClass} ${className}`}
    >
      {children}
    </button>
  );
}