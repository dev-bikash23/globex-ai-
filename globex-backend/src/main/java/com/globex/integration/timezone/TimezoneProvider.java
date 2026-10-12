package com.globex.integration.timezone;

public interface TimezoneProvider {
    String getProviderName();
    LocalTimeInfo getLocalTime(String timezoneId);

    record LocalTimeInfo(
            String timezoneId,
            String timeFormatted,
            String dateFormatted,
            String offsetFormatted,
            boolean isDaylightSaving,
            String isoTimestamp
    ) {}
}
