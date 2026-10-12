import type { WeatherResponse } from '../../types/phase4.types';
import { WeatherIcon } from './WeatherIcon';
import { DataFreshness } from '../common/DataFreshness';
import { ExternalSourceBadge } from '../common/ExternalSourceBadge';

interface Props { weather: WeatherResponse; }

export function WeatherCard({ weather }: Props) {
  const unavailable = weather.dataFreshness === 'UNAVAILABLE';

  if (unavailable) {
    return (
      <div className="weather-card weather-card--unavailable">
        <p className="weather-card__unavailable-msg">🌤️ Weather data is temporarily unavailable.</p>
      </div>
    );
  }

  return (
    <div className="weather-card">
      <div className="weather-card__current">
        <div className="weather-card__temp-row">
          <WeatherIcon icon={weather.conditionIcon} size="2.5rem" />
          <span className="weather-card__temp">{Math.round(weather.temperature)}°C</span>
        </div>
        <p className="weather-card__condition">{weather.condition}</p>
      </div>

      <div className="weather-card__details">
        <div className="weather-card__detail">
          <span className="weather-card__detail-label">Feels like</span>
          <span className="weather-card__detail-value">{Math.round(weather.feelsLike)}°C</span>
        </div>
        <div className="weather-card__detail">
          <span className="weather-card__detail-label">Wind</span>
          <span className="weather-card__detail-value">{Math.round(weather.windSpeed)} km/h</span>
        </div>
        <div className="weather-card__detail">
          <span className="weather-card__detail-label">Humidity</span>
          <span className="weather-card__detail-value">{weather.humidity}%</span>
        </div>
        <div className="weather-card__detail">
          <span className="weather-card__detail-label">Precipitation</span>
          <span className="weather-card__detail-value">{weather.precipitation} mm</span>
        </div>
      </div>

      <div className="weather-card__footer">
        <DataFreshness updatedAt={weather.updatedAt} freshness={weather.dataFreshness} />
        <ExternalSourceBadge text={weather.attribution} />
      </div>
    </div>
  );
}
