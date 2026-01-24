import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWeatherIconUrl } from '../../services/weatherApi';
import styles from './Forecast.module.css';

export function Forecast({ dailyForecast, units }) {
  const [selectedDay, setSelectedDay] = useState(null);

  if (!dailyForecast || dailyForecast.length === 0) return null;

  const speedUnit = units === 'metric' ? 'm/s' : 'mph';

  const handleDayClick = (day) => {
    setSelectedDay(selectedDay?.dt === day.dt ? null : day);
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h3 className={styles.title}>5-Day Outlook</h3>
          <span className={styles.subtitle}>Click a day for details</span>
        </div>
        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={styles.legendHigh}></span>High
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendLow}></span>Low
          </span>
        </div>
      </div>

      <div className={styles.timeline}>
        {dailyForecast.map((day, index) => (
          <ForecastDay
            key={day.dt}
            day={day}
            units={units}
            speedUnit={speedUnit}
            index={index}
            isFirst={index === 0}
            isSelected={selectedDay?.dt === day.dt}
            onClick={() => handleDayClick(day)}
          />
        ))}
      </div>
    </motion.div>
  );
}

function ForecastDay({ day, units, speedUnit, index, isFirst, isSelected, onClick }) {
  return (
    <div className={styles.dayWrapper}>
      <motion.button
        className={`${styles.dayCard} ${isFirst ? styles.today : ''} ${isSelected ? styles.selected : ''}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 + index * 0.08, duration: 0.4 }}
        onClick={onClick}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className={styles.dayHeader}>
          <span className={styles.dayName}>
            {isFirst ? 'Today' : day.dayName}
          </span>
          <span className={styles.dayDate}>
            {day.date.split(',')[1]?.trim() || day.date}
          </span>
        </div>

        <div className={styles.dayContent}>
          <img
            src={getWeatherIconUrl(day.icon)}
            alt={day.description}
            className={styles.dayIcon}
          />

          <div className={styles.dayCondition}>
            {day.description}
          </div>

          <div className={styles.tempRange}>
            <div className={styles.tempBar}>
              <motion.div
                className={styles.tempFill}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4 + index * 0.08, duration: 0.5 }}
              />
            </div>
            <div className={styles.temps}>
              <span className={styles.tempLow}>{day.tempMin}°</span>
              <span className={styles.tempHigh}>{day.tempMax}°</span>
            </div>
          </div>

          <div className={styles.expandIcon}>
            <motion.svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              animate={{ rotate: isSelected ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <path d="M6 9l6 6 6-6" />
            </motion.svg>
          </div>
        </div>
      </motion.button>

      <AnimatePresence>
        {isSelected && (
          <motion.div
            className={styles.details}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.detailsContent}>
              <div className={styles.detailsStats}>
                <div className={styles.stat}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
                  </svg>
                  <span className={styles.statLabel}>Humidity</span>
                  <span className={styles.statValue}>{day.humidity}%</span>
                </div>
                <div className={styles.stat}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" />
                  </svg>
                  <span className={styles.statLabel}>Wind</span>
                  <span className={styles.statValue}>{day.wind} {speedUnit}</span>
                </div>
              </div>

              <div className={styles.hourlyLabel}>Hourly Breakdown</div>
              <div className={styles.hourlyList}>
                {day.hourly.map((hour) => (
                  <div key={hour.dt} className={styles.hourlyItem}>
                    <span className={styles.hourlyTime}>{hour.time}</span>
                    <img
                      src={getWeatherIconUrl(hour.icon)}
                      alt={hour.description}
                      className={styles.hourlyIcon}
                    />
                    <span className={styles.hourlyTemp}>{hour.temp}°</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
