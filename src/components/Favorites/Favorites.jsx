import { motion, AnimatePresence } from 'framer-motion';
import styles from './Favorites.module.css';

export function Favorites({ favorites, onSelect, onRemove }) {
  if (favorites.length === 0) return null;

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <h3 className={styles.title}>Saved Locations</h3>
        </div>
        <span className={styles.count}>{favorites.length}</span>
      </div>

      <div className={styles.list}>
        <AnimatePresence mode="popLayout">
          {favorites.map((city, index) => (
            <motion.div
              key={city}
              className={styles.item}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, x: -20 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              <button
                className={styles.cityBtn}
                onClick={() => onSelect(city)}
              >
                <div className={styles.cityIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <span className={styles.cityName}>{city}</span>
              </button>

              <motion.button
                className={styles.removeBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(city);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Remove ${city} from favorites`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
