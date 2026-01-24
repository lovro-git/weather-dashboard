import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { Forecast } from './components/Forecast';
import { HourlyChart } from './components/HourlyChart';
import { Favorites } from './components/Favorites';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { WeatherBackground } from './components/WeatherBackground';
import { WeatherDetails } from './components/WeatherDetails';
import { useWeather } from './hooks/useWeather';
import { useForecast } from './hooks/useForecast';
import { useGeolocation } from './hooks/useGeolocation';
import { useFavorites } from './hooks/useFavorites';
import { useAirQuality } from './hooks/useAirQuality';
import { getWeatherAccent } from './services/weatherApi';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [units, setUnits] = useState('metric');
  const { location, loading: geoLoading, getLocation, clearLocation } = useGeolocation();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  const coords = location ? { lat: location.lat, lon: location.lon } : null;
  const { weather, loading: weatherLoading, error: weatherError, refetch: refetchWeather } = useWeather(
    city,
    coords,
    units
  );
  const { dailyForecast, hourlyForecast, loading: forecastLoading, error: forecastError } = useForecast(
    city,
    coords,
    units
  );

  // Get coordinates from weather data for air quality
  const weatherCoords = weather ? { lat: weather.coord.lat, lon: weather.coord.lon } : null;
  const { airQuality } = useAirQuality(weatherCoords);

  const isLoading = weatherLoading || forecastLoading;
  const error = weatherError || forecastError;
  const weatherMain = weather?.weather?.[0]?.main || 'Clear';
  const accentColor = getWeatherAccent(weatherMain);

  function handleCitySelect(selectedCity) {
    clearLocation();
    setCity(selectedCity);
  }

  function handleUseLocation() {
    setCity('');
    getLocation();
  }

  function handleToggleFavorite(cityName) {
    if (isFavorite(cityName)) {
      removeFavorite(cityName);
    } else {
      addFavorite(cityName);
    }
  }

  function handleUnitsChange(newUnits) {
    setUnits(newUnits);
  }

  return (
    <div className="app">
      <WeatherBackground weatherMain={weatherMain} accentColor={accentColor} />

      <Header units={units} onUnitsChange={handleUnitsChange} />

      <main className="main">
        <section className="search-section">
          <SearchBar
            onCitySelect={handleCitySelect}
            onUseLocation={handleUseLocation}
            locationLoading={geoLoading}
          />
        </section>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <LoadingState key="loading" />
          ) : error ? (
            <ErrorState
              key="error"
              message={error}
              onRetry={refetchWeather}
            />
          ) : weather ? (
            <div className="weather-content" key="content">
              <div className="weather-grid">
                <div className="weather-main">
                  <CurrentWeather
                    weather={weather}
                    units={units}
                    isFavorite={isFavorite(weather.name)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </div>

                <div className="weather-sidebar">
                  <HourlyChart hourlyForecast={hourlyForecast} units={units} />
                  <Forecast dailyForecast={dailyForecast} units={units} />
                </div>
              </div>

              <WeatherDetails
                weather={weather}
                airQuality={airQuality}
                units={units}
              />

              {favorites.length > 0 && (
                <Favorites
                  favorites={favorites}
                  onSelect={handleCitySelect}
                  onRemove={removeFavorite}
                />
              )}
            </div>
          ) : (
            <div className="empty-state" key="empty">
              <div className="empty-content">
                <div className="empty-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <h2 className="empty-title">Weather Observatory</h2>
                <p className="empty-text">
                  Search for a city or use your location to view current weather conditions and forecasts.
                </p>
              </div>

              {favorites.length > 0 && (
                <Favorites
                  favorites={favorites}
                  onSelect={handleCitySelect}
                  onRemove={removeFavorite}
                />
              )}
            </div>
          )}
        </AnimatePresence>
      </main>

      <footer className="footer">
        <span>Weather data provided by OpenWeatherMap</span>
      </footer>
    </div>
  );
}

export default App;
