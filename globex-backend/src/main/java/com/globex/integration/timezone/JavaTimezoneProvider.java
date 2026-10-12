package com.globex.integration.timezone;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class JavaTimezoneProvider implements TimezoneProvider {
    private static final Logger log = LoggerFactory.getLogger(JavaTimezoneProvider.class);

    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("hh:mm a");
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("EEEE, MMM d, yyyy");
    private static final DateTimeFormatter OFFSET_FORMAT = DateTimeFormatter.ofPattern("xxx");

    @Override
    public String getProviderName() {
        return "java-zoneid-tzdb";
    }

    @Override
    public LocalTimeInfo getLocalTime(String timezoneId) {
        ZoneId zone;
        try {
            if (timezoneId == null || timezoneId.isBlank()) {
                zone = ZoneId.of("UTC");
            } else {
                zone = ZoneId.of(timezoneId.trim());
            }
        } catch (Exception e) {
            log.warn("Invalid timezone ID: {}. Falling back to UTC.", timezoneId);
            zone = ZoneId.of("UTC");
        }

        ZonedDateTime now = ZonedDateTime.now(zone);
        boolean dst = zone.getRules().isDaylightSavings(now.toInstant());

        return new LocalTimeInfo(
                zone.getId(),
                now.format(TIME_FORMAT),
                now.format(DATE_FORMAT),
                "UTC" + now.format(OFFSET_FORMAT),
                dst,
                now.toInstant().toString()
        );
    }
}
