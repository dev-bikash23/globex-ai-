const WEATHER_ICONS: Record<string, string> = {
  'sun': '☀️',
  'sun-cloud': '🌤️',
  'cloud-sun': '⛅',
  'cloud': '☁️',
  'fog': '🌫️',
  'drizzle': '🌦️',
  'drizzle-snow': '🌧️',
  'rain': '🌧️',
  'rain-snow': '🌨️',
  'snow': '❄️',
  'rain-heavy': '⛈️',
  'snow-heavy': '🌨️',
  'thunder': '⛈️',
  'thunder-hail': '🌩️',
};

export function WeatherIcon({ icon, size = '1.5rem' }: { icon: string; size?: string }) {
  return (
    <span style={{ fontSize: size, lineHeight: 1 }}>
      {WEATHER_ICONS[icon] ?? '🌤️'}
    </span>
  );
}
