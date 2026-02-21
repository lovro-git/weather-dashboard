import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import styles from './HourlyChart.module.css';

function CustomTooltip({ active, payload, label, units }) {
  if (!active || !payload || !payload.length) return null;

  const tempUnit = units === 'metric' ? '°C' : '°F';

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipTime}>{label}</div>
      <div className={styles.tooltipTemp}>
        <span className={styles.tooltipValue}>{payload[0].value}</span>
        <span className={styles.tooltipUnit}>{tempUnit}</span>
      </div>
    </div>
  );
}

export function HourlyChart({ hourlyForecast, units }) {
  if (!hourlyForecast || hourlyForecast.length === 0) return null;

  const tempUnit = units === 'metric' ? '°' : '°';

  const data = hourlyForecast.map((item) => ({
    time: item.time,
    temp: item.temp
  }));

  const temps = data.map((d) => d.temp);
  const minTemp = Math.min(...temps) - 3;
  const maxTemp = Math.max(...temps) + 3;

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h3 className={styles.title}>Temperature Trend</h3>
          <span className={styles.subtitle}>Next 24 hours</span>
        </div>
        <div className={styles.currentRange}>
          <span className={styles.rangeMin}>{Math.min(...temps)}{tempUnit}</span>
          <span className={styles.rangeSep}>—</span>
          <span className={styles.rangeMax}>{Math.max(...temps)}{tempUnit}</span>
        </div>
      </div>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(91, 216, 207, 0.3)" />
                <stop offset="50%" stopColor="rgba(155, 127, 240, 0.12)" />
                <stop offset="100%" stopColor="rgba(155, 127, 240, 0)" />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#5bd8cf" />
                <stop offset="50%" stopColor="#9b7ff0" />
                <stop offset="100%" stopColor="#e8724a" />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: 'rgba(240, 237, 232, 0.3)',
                fontSize: 11,
                fontFamily: 'Outfit'
              }}
              dy={10}
              interval={0}
            />
            <YAxis
              domain={[minTemp, maxTemp]}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: 'rgba(240, 237, 232, 0.25)',
                fontSize: 11,
                fontFamily: 'Outfit'
              }}
              tickFormatter={(value) => `${Math.round(value)}°`}
              width={35}
            />
            <Tooltip
              content={<CustomTooltip units={units} />}
              cursor={{ stroke: 'rgba(240, 237, 232, 0.06)', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="url(#lineGradient)"
              strokeWidth={3}
              fill="url(#tempGradient)"
              dot={false}
              activeDot={{
                r: 6,
                fill: '#f0ede8',
                stroke: '#5bd8cf',
                strokeWidth: 2
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.hourlyPills}>
        {hourlyForecast.slice(0, 6).map((item, index) => (
          <motion.div
            key={item.dt}
            className={styles.pill}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.05 }}
          >
            <span className={styles.pillTime}>{item.time}</span>
            <span className={styles.pillTemp}>{item.temp}{tempUnit}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
