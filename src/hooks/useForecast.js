import { useState, useEffect, useCallback, useMemo } from 'react';
import { getForecast, getForecastByCoords } from '../services/weatherApi';

export function useForecast(city, coords, units = 'metric') {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const lat = coords?.lat;
  const lon = coords?.lon;

  const fetchForecast = useCallback(async () => {
    if (!city && lat == null) {
      setForecastData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let data;
      if (lat != null && lon != null) {
        data = await getForecastByCoords(lat, lon, units);
      } else {
        data = await getForecast(city, units);
      }
      setForecastData(data);
    } catch (err) {
      setError(err.message);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  }, [city, lat, lon, units]);

  useEffect(() => {
    fetchForecast();
  }, [fetchForecast]);

  const dailyForecast = useMemo(() => {
    if (!forecastData?.list) return [];

    const dailyMap = new Map();

    forecastData.list.forEach((item) => {
      const dateKey = new Date(item.dt * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, {
          dateKey,
          date: new Date(item.dt * 1000).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          }),
          dayName: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
          temps: [],
          icons: [],
          descriptions: [],
          humidity: [],
          wind: [],
          hourly: [],
          dt: item.dt
        });
      }

      const day = dailyMap.get(dateKey);
      day.temps.push(item.main.temp);
      day.icons.push(item.weather[0].icon);
      day.descriptions.push(item.weather[0].description);
      day.humidity.push(item.main.humidity);
      day.wind.push(item.wind.speed);
      day.hourly.push({
        time: new Date(item.dt * 1000).toLocaleTimeString('en-US', {
          hour: 'numeric',
          hour12: true
        }),
        temp: Math.round(item.main.temp),
        icon: item.weather[0].icon,
        description: item.weather[0].description,
        humidity: item.main.humidity,
        wind: item.wind.speed,
        dt: item.dt
      });
    });

    return Array.from(dailyMap.values())
      .slice(0, 5)
      .map((day) => ({
        date: day.date,
        dayName: day.dayName,
        tempMin: Math.round(Math.min(...day.temps)),
        tempMax: Math.round(Math.max(...day.temps)),
        icon: day.icons[Math.floor(day.icons.length / 2)],
        description: day.descriptions[Math.floor(day.descriptions.length / 2)],
        humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
        wind: (day.wind.reduce((a, b) => a + b, 0) / day.wind.length).toFixed(1),
        hourly: day.hourly,
        dt: day.dt
      }));
  }, [forecastData]);

  const hourlyForecast = useMemo(() => {
    if (!forecastData?.list) return [];

    return forecastData.list.slice(0, 8).map((item) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true
      }),
      temp: Math.round(item.main.temp),
      icon: item.weather[0].icon,
      description: item.weather[0].description,
      dt: item.dt
    }));
  }, [forecastData]);

  return {
    forecastData,
    dailyForecast,
    hourlyForecast,
    loading,
    error,
    refetch: fetchForecast
  };
}
