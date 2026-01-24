import { motion } from 'framer-motion';
import styles from './LoadingState.module.css';

export function LoadingState() {
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={styles.content}>
        <div className={styles.orbits}>
          <motion.div
            className={styles.orbit}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <div className={styles.dot} />
          </motion.div>
          <motion.div
            className={`${styles.orbit} ${styles.orbit2}`}
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          >
            <div className={styles.dot} />
          </motion.div>
          <motion.div
            className={`${styles.orbit} ${styles.orbit3}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          >
            <div className={styles.dot} />
          </motion.div>
        </div>

        <motion.div
          className={styles.text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className={styles.label}>Fetching Weather Data</span>
          <motion.span
            className={styles.dots}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ...
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}
