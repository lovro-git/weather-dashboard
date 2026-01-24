import { useState, useEffect, useCallback, useRef } from 'react';
import { getCurrentWeather, getWeatherByCoords } from '../services/weatherApi';

export function useWeather(city, coords, units = 'metric') {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const lat = coords?.lat;
  const lon = coords?.lon;

  const fetchWeather = useCallback(async () => {
    if (!city && lat == null) {
      setWeather(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let data;
      if (lat != null && lon != null) {
        data = await getWeatherByCoords(lat, lon, units);
      } else {
        data = await getCurrentWeather(city, units);
      }
      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, [city, lat, lon, units]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return { weather, loading, error, refetch: fetchWeather };
}
