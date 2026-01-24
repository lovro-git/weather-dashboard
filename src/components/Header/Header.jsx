import { motion } from 'framer-motion';
import styles from './Header.module.css';

export function Header({ units, onUnitsChange }) {
  return (
    <motion.header
      className={styles.header}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.brand}>
        <motion.div
          className={styles.logoMark}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        >
          <svg viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            <circle cx="24" cy="24" r="8" fill="currentColor" opacity="0.8" />
            <line x1="24" y1="4" x2="24" y2="12" stroke="currentColor" strokeWidth="2" />
            <line x1="24" y1="36" x2="24" y2="44" stroke="currentColor" strokeWidth="2" />
            <line x1="4" y1="24" x2="12" y2="24" stroke="currentColor" strokeWidth="2" />
            <line x1="36" y1="24" x2="44" y2="24" stroke="currentColor" strokeWidth="2" />
          </svg>
        </motion.div>
        <div className={styles.brandText}>
          <h1 className={styles.title}>Observatory</h1>
          <span className={styles.subtitle}>Weather Station</span>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.unitSwitch}>
          <button
            className={`${styles.unitBtn} ${units === 'metric' ? styles.active : ''}`}
            onClick={() => onUnitsChange('metric')}
            aria-pressed={units === 'metric'}
          >
            <span className={styles.unitSymbol}>°C</span>
            <span className={styles.unitLabel}>Celsius</span>
          </button>
          <div className={styles.divider} />
          <button
            className={`${styles.unitBtn} ${units === 'imperial' ? styles.active : ''}`}
            onClick={() => onUnitsChange('imperial')}
            aria-pressed={units === 'imperial'}
          >
            <span className={styles.unitSymbol}>°F</span>
            <span className={styles.unitLabel}>Fahrenheit</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
