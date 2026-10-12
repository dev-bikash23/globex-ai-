import { useState } from 'react';
import type { WeatherResponse } from '../../types/phase4.types';
import { WeatherIcon } from './WeatherIcon';

interface Props { weather: WeatherResponse; }

export function WeatherForecast({ weather }: Props) {
  const [tab, setTab] = useState<'hourly' | 'daily'>('daily');

  return (
    <div className="weather-forecast">
      <div className="weather-forecast__tabs">
        <button
          className={`weather-forecast__tab ${tab === 'daily' ? 'weather-forecast__tab--active' : ''}`}
          onClick={() => setTab('daily')}
        >Daily</button>
        <button
          className={`weather-forecast__tab ${tab === 'hourly' ? 'weather-forecast__tab--active' : ''}`}
          onClick={() => setTab('hourly')}
        >Hourly</button>
      </div>

      {tab === 'daily' && (
        <div className="weather-forecast__list">
          {weather.dailyForecast.map((day) => (
            <div key={day.date} className="weather-forecast__item">
              <span className="weather-forecast__day">{formatDate(day.date)}</span>
              <WeatherIcon icon={day.conditionIcon} size="1.2rem" />
              <span className="weather-forecast__temps">
                <span className="weather-forecast__high">{Math.round(day.maxTemperature)}°</span>
                <span className="weather-forecast__low">{Math.round(day.minTemperature)}°</span>
              </span>
              {day.precipitationProbabilityMax > 0 && (
                <span className="weather-forecast__rain">💧 {day.precipitationProbabilityMax}%</span>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'hourly' && (
        <div className="weather-forecast__hourly-scroll">
          {weather.hourlyForecast.slice(0, 12).map((hour) => (
            <div key={hour.time} className="weather-forecast__hour-item">
              <span className="weather-forecast__hour-time">{formatHour(hour.time)}</span>
              <WeatherIcon icon={hour.conditionIcon} size="1rem" />
              <span className="weather-forecast__hour-temp">{Math.round(hour.temperature)}°</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  } catch { return dateStr; }
}

function formatHour(timeStr: string): string {
  try {
    const d = new Date(timeStr);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
  } catch { return timeStr; }
}
