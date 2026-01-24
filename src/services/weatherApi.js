const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export async function getCurrentWeather(city, units = 'metric') {
  const response = await fetch(
    `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${API_KEY}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('City not found');
    }
    if (response.status === 401) {
      throw new Error('Invalid API key. Please set VITE_OPENWEATHER_API_KEY in .env');
    }
    throw new Error('Failed to fetch weather data');
  }

  return response.json();
}

export async function getWeatherByCoords(lat, lon, units = 'metric') {
  const response = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  return response.json();
}

export async function getForecast(city, units = 'metric') {
  const response = await fetch(
    `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=${units}&appid=${API_KEY}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('City not found');
    }
    throw new Error('Failed to fetch forecast data');
  }

  return response.json();
}

export async function getForecastByCoords(lat, lon, units = 'metric') {
  const response = await fetch(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch forecast data');
  }

  return response.json();
}

// Air Quality Index
export async function getAirQuality(lat, lon) {
  const response = await fetch(
    `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}

// UV Index (from One Call API 2.5 - may require subscription)
// Fallback: estimate from weather conditions
export async function getUVIndex(lat, lon) {
  try {
    const response = await fetch(
      `${BASE_URL}/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    if (response.ok) {
      return response.json();
    }
  } catch (e) {
    // UV endpoint may not be available on free tier
  }
  return null;
}

export async function searchCities(query) {
  if (!query || query.length < 2) return [];

  const response = await fetch(
    `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to search cities');
  }

  const data = await response.json();
  return data.map(city => ({
    name: city.name,
    country: city.country,
    state: city.state,
    lat: city.lat,
    lon: city.lon,
    display: city.state
      ? `${city.name}, ${city.state}, ${city.country}`
      : `${city.name}, ${city.country}`
  }));
}

export function getWeatherIconUrl(iconCode, size = '2x') {
  return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
}

// Map weather conditions to theme classes
export function getWeatherTheme(weatherMain) {
  const themes = {
    Clear: 'sunny',
    Clouds: 'cloudy',
    Rain: 'rain',
    Drizzle: 'rain',
    Thunderstorm: 'storm',
    Snow: 'snow',
    Mist: 'cloudy',
    Fog: 'cloudy',
    Haze: 'cloudy'
  };

  return themes[weatherMain] || 'clear';
}

// Get weather-based accent color
export function getWeatherAccent(weatherMain) {
  const accents = {
    Clear: '#fbbf24',
    Clouds: '#94a3b8',
    Rain: '#4ecdc4',
    Drizzle: '#67e8f9',
    Thunderstorm: '#a855f7',
    Snow: '#e2e8f0',
    Mist: '#cbd5e1',
    Fog: '#94a3b8',
    Haze: '#fcd34d'
  };

  return accents[weatherMain] || '#4ecdc4';
}

// AQI level descriptions
export function getAQILevel(aqi) {
  const levels = {
    1: { label: 'Good', color: '#4ade80', description: 'Air quality is satisfactory' },
    2: { label: 'Fair', color: '#facc15', description: 'Acceptable for most people' },
    3: { label: 'Moderate', color: '#fb923c', description: 'Sensitive groups may be affected' },
    4: { label: 'Poor', color: '#f87171', description: 'Health effects possible for all' },
    5: { label: 'Very Poor', color: '#dc2626', description: 'Serious health effects' }
  };
  return levels[aqi] || levels[1];
}

// UV Index level descriptions
export function getUVLevel(uv) {
  if (uv <= 2) return { label: 'Low', color: '#4ade80', description: 'No protection needed' };
  if (uv <= 5) return { label: 'Moderate', color: '#facc15', description: 'Wear sunscreen' };
  if (uv <= 7) return { label: 'High', color: '#fb923c', description: 'Protection essential' };
  if (uv <= 10) return { label: 'Very High', color: '#f87171', description: 'Extra protection needed' };
  return { label: 'Extreme', color: '#dc2626', description: 'Avoid sun exposure' };
}

// Format sunrise/sunset times
export function formatTime(timestamp, timezone) {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  });
}

// Calculate day length
export function getDayLength(sunrise, sunset) {
  const diff = sunset - sunrise;
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

// Get wind direction from degrees
export function getWindDirection(deg) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}

// Estimate UV index based on weather and time (fallback when API unavailable)
export function estimateUV(weather, timezone) {
  const now = new Date();
  const localHour = (now.getUTCHours() + timezone / 3600 + 24) % 24;

  // Night time = 0 UV
  if (localHour < 6 || localHour > 20) return 0;

  // Peak hours multiplier
  let timeMultiplier = 1;
  if (localHour >= 10 && localHour <= 14) {
    timeMultiplier = 1.5;
  } else if (localHour >= 8 && localHour <= 16) {
    timeMultiplier = 1.2;
  }

  // Weather condition multiplier
  const condition = weather?.weather?.[0]?.main || 'Clear';
  const conditionMultipliers = {
    Clear: 1,
    Clouds: 0.5,
    Rain: 0.2,
    Drizzle: 0.3,
    Thunderstorm: 0.1,
    Snow: 0.3,
    Mist: 0.4,
    Fog: 0.3,
    Haze: 0.6
  };

  const baseUV = 6; // Average mid-day UV
  return Math.round(baseUV * timeMultiplier * (conditionMultipliers[condition] || 0.5));
}
