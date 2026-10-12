package com.globex.integration.weather.dto.external;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record OpenMeteoApiResponse(
        Double latitude,
        Double longitude,
        Current current,
        Hourly hourly,
        Daily daily
) {
    public record Current(
            String time,
            @JsonProperty("temperature_2m") Double temperature2m,
            @JsonProperty("relative_humidity_2m") Integer relativeHumidity2m,
            @JsonProperty("apparent_temperature") Double apparentTemperature,
            Double precipitation,
            @JsonProperty("weather_code") Integer weatherCode,
            @JsonProperty("wind_speed_10m") Double windSpeed10m
    ) {}

    public record Hourly(
            List<String> time,
            @JsonProperty("temperature_2m") List<Double> temperature2m,
            @JsonProperty("precipitation_probability") List<Integer> precipitationProbability,
            @JsonProperty("weather_code") List<Integer> weatherCode
    ) {}

    public record Daily(
            List<String> time,
            @JsonProperty("weather_code") List<Integer> weatherCode,
            @JsonProperty("temperature_2m_max") List<Double> temperature2mMax,
            @JsonProperty("temperature_2m_min") List<Double> temperature2mMin,
            @JsonProperty("precipitation_probability_max") List<Integer> precipitationProbabilityMax
    ) {}
}
