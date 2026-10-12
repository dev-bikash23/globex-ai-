package com.globex.shared.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Binds globex.* YAML properties and registers the GlobexProperties bean.
 */
@Configuration
public class GlobexPropertiesConfig {

    @Bean
    @ConfigurationProperties(prefix = "globex")
    public GlobexProperties globexProperties() {
        return new GlobexProperties();
    }
}
