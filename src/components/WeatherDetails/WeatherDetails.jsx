import { motion } from 'framer-motion';
import {
  formatTime,
  getDayLength,
  getWindDirection,
  getAQILevel,
  getUVLevel,
  estimateUV
} from '../../services/weatherApi';
import styles from './WeatherDetails.module.css';

export function WeatherDetails({ weather, airQuality, units }) {
  if (!weather) return null;

  const speedUnit = units === 'metric' ? 'm/s' : 'mph';
  const sunrise = formatTime(weather.sys.sunrise, weather.timezone);
  const sunset = formatTime(weather.sys.sunset, weather.timezone);
  const dayLength = getDayLength(weather.sys.sunrise, weather.sys.sunset);
  const windDir = getWindDirection(weather.wind.deg || 0);

  const uvIndex = estimateUV(weather, weather.timezone);
  const uvLevel = getUVLevel(uvIndex);

  const aqi = airQuality?.main?.aqi;
  const aqiLevel = aqi ? getAQILevel(aqi) : null;
  const pm25 = airQuality?.components?.pm2_5;
  const pm10 = airQuality?.components?.pm10;

  // Precipitation data (rain or snow in mm)
  const rain1h = weather.rain?.['1h'] || 0;
  const rain3h = weather.rain?.['3h'] || 0;
  const snow1h = weather.snow?.['1h'] || 0;
  const snow3h = weather.snow?.['3h'] || 0;
  const totalPrecip = rain1h || rain3h / 3 || snow1h || snow3h / 3;
  const precipType = snow1h || snow3h ? 'snow' : 'rain';
  const precipLevel = getPrecipLevel(totalPrecip);

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>Weather Details</h3>
      </div>

      <div className={styles.grid}>
        {/* Sun Times */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </div>
            <span className={styles.cardLabel}>Sun</span>
          </div>
          <div className={styles.sunTimes}>
            <div className={styles.sunTime}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 18a5 5 0 00-10 0" />
                <path d="M12 9V2M4.22 10.22l1.42 1.42M2 18h2M20 18h2M18.36 11.64l1.42-1.42" />
              </svg>
              <div>
                <span className={styles.sunLabel}>Sunrise</span>
                <span className={styles.sunValue}>{sunrise}</span>
              </div>
            </div>
            <div className={styles.sunTime}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 18a5 5 0 00-10 0" />
                <path d="M12 2v7M4.22 10.22l1.42 1.42M2 18h2M20 18h2M18.36 11.64l1.42-1.42" />
              </svg>
              <div>
                <span className={styles.sunLabel}>Sunset</span>
                <span className={styles.sunValue}>{sunset}</span>
              </div>
            </div>
          </div>
          <div className={styles.dayLength}>
            <span>Day length:</span>
            <span className={styles.dayLengthValue}>{dayLength}</span>
          </div>
        </div>

        {/* UV Index */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon} style={{ color: uvLevel.color }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            </div>
            <span className={styles.cardLabel}>UV Index</span>
          </div>
          <div className={styles.uvContent}>
            <div className={styles.uvValue} style={{ color: uvLevel.color }}>
              {uvIndex}
            </div>
            <div className={styles.uvLevel} style={{ color: uvLevel.color }}>
              {uvLevel.label}
            </div>
            <div className={styles.uvDesc}>{uvLevel.description}</div>
          </div>
          <div className={styles.uvScale}>
            {[0, 2, 5, 7, 10, 11].map((val, i) => (
              <div
                key={val}
                className={`${styles.uvDot} ${uvIndex >= val ? styles.active : ''}`}
                style={{
                  background: uvIndex >= val ? getUVLevel(val).color : undefined
                }}
              />
            ))}
          </div>
        </div>

        {/* Precipitation */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon} style={{ color: precipLevel.color }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
              </svg>
            </div>
            <span className={styles.cardLabel}>Precipitation</span>
          </div>
          <div className={styles.precipContent}>
            <div className={styles.precipMain}>
              <span className={styles.precipValue} style={{ color: precipLevel.color }}>
                {totalPrecip.toFixed(1)}
              </span>
              <span className={styles.precipUnit}>mm/h</span>
            </div>
            <div className={styles.precipLevel} style={{ color: precipLevel.color }}>
              {precipLevel.label}
            </div>
            <div className={styles.precipType}>
              {precipType === 'snow' ? 'Snowfall' : 'Rainfall'}
            </div>
          </div>
          <div className={styles.precipMeter}>
            <div className={styles.precipMeterTrack}>
              <div
                className={styles.precipMeterFill}
                style={{
                  width: `${Math.min((totalPrecip / 10) * 100, 100)}%`,
                  background: precipLevel.color
                }}
              />
            </div>
            <div className={styles.precipScale}>
              <span>0</span>
              <span>Light</span>
              <span>Moderate</span>
              <span>Heavy</span>
            </div>
          </div>
          {(rain3h > 0 || snow3h > 0) && (
            <div className={styles.precipForecast}>
              <span>Last 3 hours:</span>
              <span className={styles.precipForecastValue}>
                {(rain3h || snow3h).toFixed(1)} mm
              </span>
            </div>
          )}
        </div>

        {/* Wind Details */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" />
              </svg>
            </div>
            <span className={styles.cardLabel}>Wind</span>
          </div>
          <div className={styles.windContent}>
            <div className={styles.windMain}>
              <span className={styles.windSpeed}>{weather.wind.speed}</span>
              <span className={styles.windUnit}>{speedUnit}</span>
            </div>
            <div className={styles.windCompass}>
              <motion.div
                className={styles.compassArrow}
                style={{ rotate: weather.wind.deg || 0 }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L8 10h8L12 2z" />
                </svg>
              </motion.div>
              <span className={styles.windDirection}>{windDir}</span>
            </div>
          </div>
          {weather.wind.gust && (
            <div className={styles.windGust}>
              Gusts up to {weather.wind.gust} {speedUnit}
            </div>
          )}
        </div>

        {/* Air Quality */}
        {aqiLevel && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon} style={{ color: aqiLevel.color }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className={styles.cardLabel}>Air Quality</span>
            </div>
            <div className={styles.aqiContent}>
              <div className={styles.aqiMain}>
                <span className={styles.aqiValue} style={{ color: aqiLevel.color }}>
                  {aqi}
                </span>
                <span className={styles.aqiLevel} style={{ color: aqiLevel.color }}>
                  {aqiLevel.label}
                </span>
              </div>
              <div className={styles.aqiDesc}>{aqiLevel.description}</div>
            </div>
            <div className={styles.aqiComponents}>
              {pm25 != null && (
                <div className={styles.aqiComponent}>
                  <span className={styles.aqiComponentLabel}>PM2.5</span>
                  <span className={styles.aqiComponentValue}>{pm25.toFixed(1)}</span>
                </div>
              )}
              {pm10 != null && (
                <div className={styles.aqiComponent}>
                  <span className={styles.aqiComponentLabel}>PM10</span>
                  <span className={styles.aqiComponentValue}>{pm10.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Additional Stats */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </svg>
            </div>
            <span className={styles.cardLabel}>Atmosphere</span>
          </div>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Pressure</span>
              <span className={styles.statValue}>{weather.main.pressure} hPa</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Humidity</span>
              <span className={styles.statValue}>{weather.main.humidity}%</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Visibility</span>
              <span className={styles.statValue}>{(weather.visibility / 1000).toFixed(1)} km</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Clouds</span>
              <span className={styles.statValue}>{weather.clouds?.all || 0}%</span>
            </div>
          </div>
        </div>

        {/* "What to Wear" Suggestions */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" />
              </svg>
            </div>
            <span className={styles.cardLabel}>What to Wear</span>
          </div>
          <div className={styles.suggestions}>
            {getSuggestions(weather, units).map((suggestion, i) => (
              <div key={i} className={styles.suggestion}>
                <span className={styles.suggestionIcon}>{suggestion.icon}</span>
                <span className={styles.suggestionText}>{suggestion.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function getSuggestions(weather, units) {
  const suggestions = [];
  const temp = weather.main.temp;
  const condition = weather.weather?.[0]?.main || '';
  const humidity = weather.main.humidity;
  const wind = weather.wind.speed;

  const isCold = units === 'metric' ? temp < 10 : temp < 50;
  const isHot = units === 'metric' ? temp > 25 : temp > 77;
  const isWindy = units === 'metric' ? wind > 5 : wind > 11;

  // Temperature-based
  if (isCold) {
    suggestions.push({ icon: '🧥', text: 'Wear a warm jacket' });
    if (temp < (units === 'metric' ? 0 : 32)) {
      suggestions.push({ icon: '🧤', text: 'Gloves recommended' });
    }
  } else if (isHot) {
    suggestions.push({ icon: '👕', text: 'Light, breathable clothing' });
    suggestions.push({ icon: '💧', text: 'Stay hydrated' });
  } else {
    suggestions.push({ icon: '🧥', text: 'Light layers recommended' });
  }

  // Weather condition-based
  if (condition === 'Rain' || condition === 'Drizzle') {
    suggestions.push({ icon: '☔', text: 'Bring an umbrella' });
    suggestions.push({ icon: '👢', text: 'Waterproof shoes' });
  } else if (condition === 'Snow') {
    suggestions.push({ icon: '🥾', text: 'Warm, waterproof boots' });
    suggestions.push({ icon: '🧣', text: 'Scarf and hat' });
  } else if (condition === 'Clear' && isHot) {
    suggestions.push({ icon: '🕶️', text: 'Sunglasses needed' });
    suggestions.push({ icon: '🧴', text: 'Apply sunscreen' });
  }

  // Wind-based
  if (isWindy) {
    suggestions.push({ icon: '🌬️', text: 'Windbreaker recommended' });
  }

  // Humidity-based
  if (humidity > 80 && isHot) {
    suggestions.push({ icon: '😓', text: 'High humidity - avoid heavy activity' });
  }

  return suggestions.slice(0, 4);
}

function getPrecipLevel(mm) {
  if (mm === 0) return { label: 'None', color: '#94a3b8' };
  if (mm < 2.5) return { label: 'Light', color: '#67e8f9' };
  if (mm < 7.5) return { label: 'Moderate', color: '#4ecdc4' };
  if (mm < 15) return { label: 'Heavy', color: '#3b82f6' };
  return { label: 'Intense', color: '#6366f1' };
}
