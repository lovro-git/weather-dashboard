import { motion } from 'framer-motion';
import { getWeatherIconUrl } from '../../services/weatherApi';
import styles from './CurrentWeather.module.css';

export function CurrentWeather({ weather, units, isFavorite, onToggleFavorite }) {
  if (!weather) return null;

  const tempUnit = units === 'metric' ? '°C' : '°F';
  const speedUnit = units === 'metric' ? 'm/s' : 'mph';
  const temp = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Top section with location and favorite */}
      <div className={styles.header}>
        <div className={styles.location}>
          <motion.div
            className={styles.locationPin}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </motion.div>
          <div className={styles.locationText}>
            <h2 className={styles.cityName}>{weather.name}</h2>
            <span className={styles.country}>{weather.sys.country}</span>
          </div>
        </div>

        <motion.button
          className={`${styles.favoriteBtn} ${isFavorite ? styles.active : ''}`}
          onClick={() => onToggleFavorite(weather.name)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </motion.button>
      </div>

      {/* Central temperature display - instrument-like */}
      <div className={styles.mainDisplay}>
        <motion.img
          src={getWeatherIconUrl(weather.weather[0].icon, '4x')}
          alt={weather.weather[0].description}
          className={styles.weatherIcon}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        />

        <div className={styles.temperatureDisplay}>
          <motion.div
            className={styles.tempValue}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
          >
            <span className={styles.tempNumber}>{temp}</span>
            <span className={styles.tempUnit}>{tempUnit}</span>
          </motion.div>

          <div className={styles.condition}>
            <span className={styles.conditionText}>{weather.weather[0].description}</span>
            <span className={styles.feelsLike}>Feels like {feelsLike}{tempUnit}</span>
          </div>
        </div>
      </div>

      {/* Instrument gauges for details */}
      <div className={styles.gauges}>
        <GaugeItem
          label="Humidity"
          value={weather.main.humidity}
          unit="%"
          max={100}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
            </svg>
          }
          delay={0.4}
        />
        <GaugeItem
          label="Wind"
          value={weather.wind.speed}
          unit={speedUnit}
          max={units === 'metric' ? 30 : 70}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" />
            </svg>
          }
          delay={0.5}
        />
        <GaugeItem
          label="Pressure"
          value={weather.main.pressure}
          unit="hPa"
          max={1050}
          min={950}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          }
          delay={0.6}
        />
        <GaugeItem
          label="Visibility"
          value={(weather.visibility / 1000).toFixed(1)}
          unit="km"
          max={10}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          }
          delay={0.7}
        />
      </div>
    </motion.div>
  );
}

function GaugeItem({ label, value, unit, max, min = 0, icon, delay }) {
  const percentage = Math.min(((value - min) / (max - min)) * 100, 100);

  return (
    <motion.div
      className={styles.gauge}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <div className={styles.gaugeIcon}>{icon}</div>
      <div className={styles.gaugeContent}>
        <div className={styles.gaugeHeader}>
          <span className={styles.gaugeLabel}>{label}</span>
          <span className={styles.gaugeValue}>
            {value}<span className={styles.gaugeUnit}>{unit}</span>
          </span>
        </div>
        <div className={styles.gaugeBar}>
          <motion.div
            className={styles.gaugeFill}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ delay: delay + 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>
    </motion.div>
  );
}
