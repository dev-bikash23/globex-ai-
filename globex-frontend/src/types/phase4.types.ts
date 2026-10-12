// Phase 4 TypeScript types — normalized GlobeX DTOs

export interface HourlyForecast {
  time: string;
  temperature: number;
  precipitationProbability: number;
  weatherCode: number;
  condition: string;
  conditionIcon: string;
}

export interface ForecastDay {
  date: string;
  maxTemperature: number;
  minTemperature: number;
  precipitationProbabilityMax: number;
  weatherCode: number;
  condition: string;
  conditionIcon: string;
}

export interface WeatherResponse {
  destinationId: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  weatherCode: number;
  condition: string;
  conditionIcon: string;
  hourlyForecast: HourlyForecast[];
  dailyForecast: ForecastDay[];
  updatedAt: string | null;
  source: string;
  dataFreshness: 'REAL_TIME' | 'CACHED' | 'UNAVAILABLE';
  attribution: string;
}

export interface CurrencyRateResponse {
  baseCurrency: string;
  targetCurrency: string;
  rate: number;
  date: string | null;
  updatedAt: string;
  source: string;
  note: string;
  attribution: string;
}

export interface PlaceResponse {
  id: string;
  name: string;
  category: string;
  type: string;
  latitude: number;
  longitude: number;
  distanceMeters: number | null;
  address: string | null;
  description: string | null;
  website: string | null;
  openingHours: string | null;
  source: string;
  attribution: string;
}

export interface DestinationImageResponse {
  id: string;
  imageUrl: string;
  thumbnailUrl: string;
  photographer: string;
  photographerUrl: string;
  attributionHtml: string;
  source: string;
}

export interface LocalTimeInfo {
  timezoneId: string;
  timeFormatted: string;
  dateFormatted: string;
  offsetFormatted: string;
  isDaylightSaving: boolean;
  isoTimestamp: string;
}
