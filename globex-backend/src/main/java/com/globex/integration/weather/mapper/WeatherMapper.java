package com.globex.integration.weather.mapper;

import com.globex.integration.weather.dto.ForecastDay;
import com.globex.integration.weather.dto.HourlyForecast;
import com.globex.integration.weather.dto.WeatherResponse;
import com.globex.integration.weather.dto.external.OpenMeteoApiResponse;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Component
public class WeatherMapper {

    public record ConditionInfo(String description, String icon) {}

    public ConditionInfo mapWmoCode(Integer code) {
        if (code == null) return new ConditionInfo("Unknown", "cloud");
        return switch (code) {
            case 0 -> new ConditionInfo("Clear Sky", "sun");
            case 1 -> new ConditionInfo("Mainly Clear", "sun-cloud");
            case 2 -> new ConditionInfo("Partly Cloudy", "cloud-sun");
            case 3 -> new ConditionInfo("Overcast", "cloud");
            case 45, 48 -> new ConditionInfo("Foggy", "fog");
            case 51, 53, 55 -> new ConditionInfo("Drizzle", "drizzle");
            case 56, 57 -> new ConditionInfo("Freezing Drizzle", "drizzle-snow");
            case 61, 63, 65 -> new ConditionInfo("Rain", "rain");
            case 66, 67 -> new ConditionInfo("Freezing Rain", "rain-snow");
            case 71, 73, 75, 77 -> new ConditionInfo("Snow", "snow");
            case 80, 81, 82 -> new ConditionInfo("Rain Showers", "rain-heavy");
            case 85, 86 -> new ConditionInfo("Snow Showers", "snow-heavy");
            case 95 -> new ConditionInfo("Thunderstorm", "thunder");
            case 96, 99 -> new ConditionInfo("Thunderstorm with Hail", "thunder-hail");
            default -> new ConditionInfo("Cloudy", "cloud");
        };
    }

    public WeatherResponse toWeatherResponse(String destinationId, OpenMeteoApiResponse raw) {
        if (raw == null || raw.current() == null) {
            return WeatherResponse.unavailable(destinationId, "Empty provider response");
        }

        var current = raw.current();
        var condition = mapWmoCode(current.weatherCode());

        // Map up to 24 hours of hourly forecast
        List<HourlyForecast> hourly = new ArrayList<>();
        if (raw.hourly() != null && raw.hourly().time() != null) {
            int limit = Math.min(24, raw.hourly().time().size());
            for (int i = 0; i < limit; i++) {
                String time = raw.hourly().time().get(i);
                Double temp = (raw.hourly().temperature2m() != null && raw.hourly().temperature2m().size() > i)
                        ? raw.hourly().temperature2m().get(i) : 0.0;
                Integer prob = (raw.hourly().precipitationProbability() != null && raw.hourly().precipitationProbability().size() > i)
                        ? raw.hourly().precipitationProbability().get(i) : 0;
                Integer wCode = (raw.hourly().weatherCode() != null && raw.hourly().weatherCode().size() > i)
                        ? raw.hourly().weatherCode().get(i) : 0;
                var hCond = mapWmoCode(wCode);

                hourly.add(new HourlyForecast(
                        time,
                        temp != null ? temp : 0.0,
                        prob != null ? prob : 0,
                        wCode != null ? wCode : 0,
                        hCond.description(),
                        hCond.icon()
                ));
            }
        }

        // Map up to 7 days of daily forecast
        List<ForecastDay> daily = new ArrayList<>();
        if (raw.daily() != null && raw.daily().time() != null) {
            int limit = Math.min(7, raw.daily().time().size());
            for (int i = 0; i < limit; i++) {
                String date = raw.daily().time().get(i);
                Double maxTemp = (raw.daily().temperature2mMax() != null && raw.daily().temperature2mMax().size() > i)
                        ? raw.daily().temperature2mMax().get(i) : 0.0;
                Double minTemp = (raw.daily().temperature2mMin() != null && raw.daily().temperature2mMin().size() > i)
                        ? raw.daily().temperature2mMin().get(i) : 0.0;
                Integer probMax = (raw.daily().precipitationProbabilityMax() != null && raw.daily().precipitationProbabilityMax().size() > i)
                        ? raw.daily().precipitationProbabilityMax().get(i) : 0;
                Integer wCode = (raw.daily().weatherCode() != null && raw.daily().weatherCode().size() > i)
                        ? raw.daily().weatherCode().get(i) : 0;
                var dCond = mapWmoCode(wCode);

                daily.add(new ForecastDay(
                        date,
                        maxTemp != null ? maxTemp : 0.0,
                        minTemp != null ? minTemp : 0.0,
                        probMax != null ? probMax : 0,
                        wCode != null ? wCode : 0,
                        dCond.description(),
                        dCond.icon()
                ));
            }
        }

        return new WeatherResponse(
                destinationId,
                current.temperature2m() != null ? current.temperature2m() : 0.0,
                current.apparentTemperature() != null ? current.apparentTemperature() : 0.0,
                current.relativeHumidity2m() != null ? current.relativeHumidity2m() : 0,
                current.windSpeed10m() != null ? current.windSpeed10m() : 0.0,
                current.precipitation() != null ? current.precipitation() : 0.0,
                current.weatherCode() != null ? current.weatherCode() : 0,
                condition.description(),
                condition.icon(),
                hourly,
                daily,
                Instant.now().toString(),
                "Open-Meteo",
                "REAL_TIME",
                "Weather data by Open-Meteo.com (CC BY 4.0)"
        );
    }
}
