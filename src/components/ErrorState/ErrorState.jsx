import { motion } from 'framer-motion';
import styles from './ErrorState.module.css';

export function ErrorState({ message, onRetry }) {
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.content}>
        <motion.div
          className={styles.icon}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        </motion.div>

        <div className={styles.text}>
          <h3 className={styles.title}>Something went wrong</h3>
          <p className={styles.message}>{message || 'Unable to fetch weather data'}</p>
        </div>

        {onRetry && (
          <motion.button
            className={styles.retryBtn}
            onClick={onRetry}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 4v6h6M23 20v-6h-6" />
              <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
            </svg>
            Try Again
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
