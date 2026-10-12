package com.globex.shared.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * Redis configuration — custom serialization only.
 * Spring Boot auto-configures StringRedisTemplate via RedisAutoConfiguration.
 * This class only adds the JSON-value RedisTemplate<String, Object> bean.
 */
@Configuration
public class RedisConfig {

    /**
     * General-purpose RedisTemplate with JSON value serialization.
     * Use for storing complex objects (e.g., session data, weather cache).
     * 
     * Note: Spring Boot auto-configures StringRedisTemplate (String keys + String values).
     * That auto-configured bean is injected directly as RedisTemplate<String, String>
     * wherever needed — we do NOT redeclare it here to avoid BeanDefinitionOverrideException.
     */
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        StringRedisSerializer stringSerializer = new StringRedisSerializer();
        template.setKeySerializer(stringSerializer);
        template.setHashKeySerializer(stringSerializer);

        GenericJackson2JsonRedisSerializer jsonSerializer = new GenericJackson2JsonRedisSerializer();
        template.setValueSerializer(jsonSerializer);
        template.setHashValueSerializer(jsonSerializer);

        template.afterPropertiesSet();
        return template;
    }
}
