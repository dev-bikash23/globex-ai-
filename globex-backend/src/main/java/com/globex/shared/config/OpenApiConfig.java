package com.globex.shared.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI 3 / Swagger configuration.
 *
 * <h2>Access Swagger UI:</h2>
 * http://localhost:8080/swagger-ui.html
 *
 * <h2>Access OpenAPI JSON spec:</h2>
 * http://localhost:8080/api-docs
 *
 * <h2>JWT in Swagger:</h2>
 * Click "Authorize" in Swagger UI, enter your JWT token.
 * All subsequent requests will include the Authorization: Bearer {token} header.
 */
@Configuration
public class OpenApiConfig {

    private static final String JWT_SCHEME_NAME = "Bearer Authentication";

    @Bean
    public OpenAPI globexOpenAPI() {
        return new OpenAPI()
                .info(apiInfo())
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Local Development"),
                        new Server().url("https://api.globexai.com").description("Production")
                ))
                // Security scheme: JWT Bearer token
                .components(new Components()
                        .addSecuritySchemes(JWT_SCHEME_NAME, jwtSecurityScheme()))
                // Apply JWT requirement globally (can be overridden per endpoint)
                .addSecurityItem(new SecurityRequirement().addList(JWT_SCHEME_NAME));
    }

    private Info apiInfo() {
        return new Info()
                .title("GlobeX AI — REST API")
                .description("""
                        **GlobeX AI** is a production-quality Java Full Stack travel platform.
                        
                        "Explore the World. Understand the Culture. Plan Better. Travel Safely. Preserve the Memories."
                        
                        ## Authentication
                        Most endpoints require a JWT Bearer token.
                        1. Register at `POST /api/v1/auth/register`
                        2. Login at `POST /api/v1/auth/login` to receive an access token
                        3. Click **Authorize** above and enter: `Bearer {your_token}`
                        
                        ## Phase 1 — Foundation
                        This version covers the application foundation: authentication, user management,
                        and infrastructure endpoints.
                        """)
                .version("1.0.0-SNAPSHOT")
                .contact(new Contact()
                        .name("GlobeX AI Team")
                        .email("dev@globexai.com"))
                .license(new License()
                        .name("Proprietary")
                        .url("https://globexai.com/terms"));
    }

    private SecurityScheme jwtSecurityScheme() {
        return new SecurityScheme()
                .name(JWT_SCHEME_NAME)
                .description("Enter JWT Bearer token. Example: Bearer eyJhbGci...")
                .scheme("bearer")
                .type(SecurityScheme.Type.HTTP)
                .bearerFormat("JWT")
                .in(SecurityScheme.In.HEADER);
    }
}
