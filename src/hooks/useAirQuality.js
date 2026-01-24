import { useState, useEffect, useCallback } from 'react';
import { getAirQuality } from '../services/weatherApi';

export function useAirQuality(coords) {
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const lat = coords?.lat;
  const lon = coords?.lon;

  const fetchAirQuality = useCallback(async () => {
    if (lat == null || lon == null) {
      setAirQuality(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getAirQuality(lat, lon);
      if (data?.list?.[0]) {
        setAirQuality(data.list[0]);
      } else {
        setAirQuality(null);
      }
    } catch (err) {
      setError(err.message);
      setAirQuality(null);
    } finally {
      setLoading(false);
    }
  }, [lat, lon]);

  useEffect(() => {
    fetchAirQuality();
  }, [fetchAirQuality]);

  return { airQuality, loading, error, refetch: fetchAirQuality };
}
