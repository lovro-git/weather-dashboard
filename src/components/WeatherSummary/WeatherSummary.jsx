import { motion } from 'framer-motion';
import { formatTime, getWindDirection, getDayLength, getWeatherIconUrl } from '../../services/weatherApi';
import styles from './WeatherSummary.module.css';

export function WeatherSummary({ weather, dailyForecast, units }) {
  if (!weather) return null;

  const tempUnit = units === 'metric' ? '°' : '°';
  const speedUnit = units === 'metric' ? 'm/s' : 'mph';
  const today = dailyForecast?.[0];
  const tomorrow = dailyForecast?.[1];
  const upcoming = dailyForecast?.slice(1, 4) || [];
  const sunrise = formatTime(weather.sys.sunrise, weather.timezone);
  const sunset = formatTime(weather.sys.sunset, weather.timezone);
  const dayLength = getDayLength(weather.sys.sunrise, weather.sys.sunset);

  const condition = weather.weather?.[0]?.main || 'Clear';
  const description = weather.weather?.[0]?.description || '';
  const humidity = weather.main.humidity;
  const temp = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const windSpeed = weather.wind.speed;
  const windDir = getWindDirection(weather.wind.deg || 0);
  const pressure = weather.main.pressure;
  const clouds = weather.clouds?.all || 0;
  const visibility = (weather.visibility / 1000).toFixed(1);

  function getComfortLevel() {
    const isCold = units === 'metric' ? temp < 5 : temp < 41;
    const isCool = units === 'metric' ? temp < 15 : temp < 59;
    const isWarm = units === 'metric' ? temp > 25 : temp > 77;
    const isHot = units === 'metric' ? temp > 35 : temp > 95;
    const isHumid = humidity > 70;
    const isWindy = units === 'metric' ? windSpeed > 6 : windSpeed > 13;

    if (isHot && isHumid) return { label: 'Uncomfortable', color: 'var(--accent-warm)', level: 1 };
    if (isHot) return { label: 'Hot', color: 'var(--accent-warm)', level: 2 };
    if (isCold && isWindy) return { label: 'Harsh', color: 'var(--accent-cool)', level: 1 };
    if (isCold) return { label: 'Cold', color: 'var(--accent-cool)', level: 2 };
    if (isWarm && isHumid) return { label: 'Muggy', color: 'var(--accent-glow)', level: 3 };
    if (isCool && isWindy) return { label: 'Brisk', color: 'var(--accent-cool)', level: 3 };
    if (condition === 'Rain' || condition === 'Drizzle') return { label: 'Damp', color: 'var(--accent-electric)', level: 3 };
    return { label: 'Pleasant', color: 'var(--accent-cool)', level: 5 };
  }

  function getSummaryText() {
    const isCold = units === 'metric' ? temp < 10 : temp < 50;
    const isHot = units === 'metric' ? temp > 30 : temp > 86;
    const isWindy = units === 'metric' ? windSpeed > 5 : windSpeed > 11;
    const isHumid = humidity > 75;
    const feelsOff = Math.abs(feelsLike - temp) >= 3;

    const parts = [];

    parts.push(`Currently ${description} at ${temp}${tempUnit}`);

    if (feelsOff) {
      const dir = feelsLike > temp ? 'warmer' : 'cooler';
      parts[0] += `, though it feels ${dir} at ${feelsLike}${tempUnit}`;
    }

    if (isWindy) {
      const gustNote = weather.wind.gust
        ? ` with gusts up to ${Math.round(weather.wind.gust)} ${speedUnit}`
        : '';
      parts.push(`Winds from the ${windDir} at ${windSpeed} ${speedUnit}${gustNote}`);
    }

    if (isHot && isHumid) {
      parts.push('High humidity is making it feel oppressive — stay hydrated and seek shade');
    } else if (isHumid) {
      parts.push(`Humidity is elevated at ${humidity}%, expect a muggy feel`);
    }

    if (clouds > 80 && condition !== 'Rain') {
      parts.push('Heavy cloud cover is blocking most sunlight');
    } else if (clouds < 10 && condition === 'Clear') {
      parts.push('Skies are clear with excellent visibility');
    }

    if (condition === 'Rain' || condition === 'Drizzle') {
      parts.push('Carry an umbrella and watch for wet roads');
    } else if (condition === 'Thunderstorm') {
      parts.push('Thunderstorms in the area — stay indoors if possible');
    } else if (condition === 'Snow') {
      parts.push('Watch for slippery surfaces and reduced visibility');
    } else if (condition === 'Mist' || condition === 'Fog') {
      parts.push(`Visibility reduced to ${visibility} km — drive with caution`);
    }

    if (tomorrow && today) {
      const todayAvg = (today.tempMax + today.tempMin) / 2;
      const tomorrowAvg = (tomorrow.tempMax + tomorrow.tempMin) / 2;
      const diff = Math.round(tomorrowAvg - todayAvg);
      if (Math.abs(diff) >= 3) {
        const change = diff > 0 ? `${Math.abs(diff)}° warmer` : `${Math.abs(diff)}° cooler`;
        parts.push(`Tomorrow expected ${change}`);
      }
    }

    if (pressure < 1000) {
      parts.push('Low pressure may bring unsettled weather');
    } else if (pressure > 1025) {
      parts.push('High pressure keeping conditions stable');
    }

    return parts.join('. ') + '.';
  }

  const comfort = getComfortLevel();

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className={styles.label}>Today's Outlook</span>
      <p className={styles.text}>{getSummaryText()}</p>

      {/* Comfort index */}
      <div className={styles.comfort}>
        <div className={styles.comfortHeader}>
          <span className={styles.comfortLabel}>Comfort</span>
          <span className={styles.comfortLevel} style={{ color: comfort.color }}>
            {comfort.label}
          </span>
        </div>
        <div className={styles.comfortBar}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`${styles.comfortDot} ${i <= comfort.level ? styles.comfortDotActive : ''}`}
              style={i <= comfort.level ? { background: comfort.color } : undefined}
            />
          ))}
        </div>
      </div>

      {/* Stat tiles — 3x2 grid */}
      <div className={styles.stats}>
        {today && (
          <div className={styles.stat}>
            <span className={styles.statLabel}>High / Low</span>
            <span className={styles.statValue}>
              <span className={styles.high}>{today.tempMax}{tempUnit}</span>
              <span className={styles.sep}>/</span>
              <span className={styles.low}>{today.tempMin}{tempUnit}</span>
            </span>
          </div>
        )}
        <div className={styles.stat}>
          <span className={styles.statLabel}>Feels Like</span>
          <span className={styles.statValue}>{feelsLike}{tempUnit}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Wind</span>
          <span className={styles.statValue}>{windSpeed} {speedUnit} {windDir}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Humidity</span>
          <span className={styles.statValue}>{humidity}%</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Sunrise</span>
          <span className={styles.statValue}>{sunrise}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Sunset</span>
          <span className={styles.statValue}>{sunset}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Daylight</span>
          <span className={styles.statValue}>{dayLength}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Pressure</span>
          <span className={styles.statValue}>{pressure} hPa</span>
        </div>
      </div>

      {/* Upcoming days mini strip */}
      {upcoming.length > 0 && (
        <div className={styles.upcoming}>
          <span className={styles.upcomingLabel}>Coming Up</span>
          <div className={styles.upcomingDays}>
            {upcoming.map((day) => (
              <div key={day.dt} className={styles.upcomingDay}>
                <span className={styles.upcomingDayName}>{day.dayName}</span>
                <img
                  src={getWeatherIconUrl(day.icon)}
                  alt={day.description}
                  className={styles.upcomingIcon}
                />
                <div className={styles.upcomingTemps}>
                  <span className={styles.high}>{day.tempMax}{tempUnit}</span>
                  <span className={styles.low}>{day.tempMin}{tempUnit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
