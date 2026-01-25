# Weather Dashboard

React weather dashboard with current conditions, 5-day forecast, hourly temperature charts, and detailed weather metrics.

## Features

- **Current Weather** - Temperature, conditions, feels like, humidity
- **5-Day Forecast** - Expandable daily cards with hourly breakdown
- **Hourly Chart** - Temperature trend visualization
- **City Search** - Autocomplete with debouncing
- **Geolocation** - Use current location
- **Favorites** - Save locations (persisted in localStorage)
- **Units Toggle** - Celsius/Fahrenheit switching
- **Weather Details Panel**:
  - Sunrise/sunset with day length
  - UV index with protection recommendations
  - Wind speed with compass direction
  - Air quality index (AQI, PM2.5, PM10)
  - Precipitation meter (rain/snow intensity)
  - Atmosphere stats (pressure, humidity, visibility, clouds)
  - "What to Wear" suggestions

## Tech Stack

- React 18, Vite 4, Recharts, Framer Motion
- OpenWeatherMap API (weather, forecast, air pollution endpoints)

## Setup

```bash
git clone https://github.com/lovro-git/weather-dashboard.git
cd weather-dashboard
bun install
```

### API Key

1. Get a free API key from [OpenWeatherMap](https://home.openweathermap.org/api_keys)
2. Create `.env` file:

```bash
cp .env.example .env
```

3. Add your key to `.env`:

```
VITE_OPENWEATHER_API_KEY=your_api_key
```

> New API keys take up to 2 hours to activate.

### Run

```bash
bun run dev        # Development server at localhost:5173
bun run build      # Production build to dist/
bun run preview    # Preview production build
```

## Deploy

### Vercel

```bash
bun add -g vercel
vercel
```

Add `VITE_OPENWEATHER_API_KEY` in Vercel dashboard → Settings → Environment Variables.

### Netlify

```bash
bun run build
```

Drag `dist/` folder to [Netlify Drop](https://app.netlify.com/drop) or connect repo.

Add environment variable in Site Settings → Environment Variables.

### Docker

```dockerfile
FROM oven/bun:1 AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
ARG VITE_OPENWEATHER_API_KEY
ENV VITE_OPENWEATHER_API_KEY=$VITE_OPENWEATHER_API_KEY
RUN bun run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

```bash
docker build --build-arg VITE_OPENWEATHER_API_KEY=your_key -t weather-dashboard .
docker run -p 8080:80 weather-dashboard
```

### GitHub Pages

1. Add to `vite.config.js`:
```js
export default defineConfig({
  base: '/weather-dashboard/',
  // ...
})
```

2. Build and deploy:
```bash
bun run build
bunx gh-pages -d dist
```

3. Set `VITE_OPENWEATHER_API_KEY` in repo Settings → Secrets → Actions.

## Project Structure

```
src/
├── components/
│   ├── CurrentWeather/   # Main weather display
│   ├── Forecast/         # 5-day forecast with expandable details
│   ├── HourlyChart/      # Temperature trend chart
│   ├── WeatherDetails/   # Extended weather metrics panel
│   ├── SearchBar/        # City search with autocomplete
│   ├── Favorites/        # Saved locations
│   └── Header/           # App header with units toggle
├── hooks/
│   ├── useWeather.js     # Current weather data
│   ├── useForecast.js    # Forecast data
│   ├── useAirQuality.js  # Air pollution data
│   ├── useGeolocation.js # Browser geolocation
│   ├── useDebounce.js    # Search debouncing
│   └── useFavorites.js   # localStorage persistence
├── services/
│   └── weatherApi.js     # API calls and utilities
├── App.jsx
└── index.css
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_OPENWEATHER_API_KEY` | Yes | OpenWeatherMap API key |

## API Limits

OpenWeatherMap free tier: 1,000 calls/day, 60 calls/minute.

## License

MIT
