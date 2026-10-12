package com.globex.shared.security;

import com.globex.shared.config.GlobexProperties;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT Authentication Filter — validates Bearer tokens on every request.
 *
 * Flow: Extract JWT → validate signature → check not blocklisted → load user → set SecurityContext
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private static final String BEARER_PREFIX = "Bearer ";
    private static final String AUTH_HEADER   = "Authorization";

    private final JwtService jwtService;
    private final GlobexUserDetailsService userDetailsService;
    private final RedisTemplate<String, String> stringRedisTemplate;
    private final GlobexProperties props;

    public JwtAuthenticationFilter(JwtService jwtService,
                                   GlobexUserDetailsService userDetailsService,
                                   RedisTemplate<String, String> stringRedisTemplate,
                                   GlobexProperties props) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.stringRedisTemplate = stringRedisTemplate;
        this.props = props;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader(AUTH_HEADER);
        if (!StringUtils.hasText(authHeader) || !authHeader.startsWith(BEARER_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(BEARER_PREFIX.length());
        try {
            final String username = jwtService.extractUsername(jwt);
            final String jti      = jwtService.extractJti(jwt);

            if (StringUtils.hasText(username) &&
                    SecurityContextHolder.getContext().getAuthentication() == null) {

                // Check revocation blocklist in Redis (skip gracefully if Redis unavailable)
                String blockedKey = props.getRedis().getTokenBlocklistPrefix() + jti;
                try {
                    if (Boolean.TRUE.equals(stringRedisTemplate.hasKey(blockedKey))) {
                        log.warn("Revoked token used — JTI: {}", jti);
                        filterChain.doFilter(request, response);
                        return;
                    }
                } catch (Exception redisEx) {
                    log.warn("Redis unavailable — skipping token revocation check for JTI: {}. Reason: {}", jti, redisEx.getMessage());
                    // Continue authentication without revocation check
                }

                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    log.debug("Authenticated: {} → {}", username, request.getRequestURI());
                }
            }
        } catch (ExpiredJwtException e) {
            log.debug("Expired JWT for path: {}", request.getRequestURI());
        } catch (JwtException e) {
            log.warn("Invalid JWT for path: {} — {}", request.getRequestURI(), e.getMessage());
        } catch (Exception e) {
            log.error("JWT filter error: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return path.startsWith("/api/v1/auth/")
            || path.startsWith("/swagger-ui")
            || path.startsWith("/api-docs")
            || path.startsWith("/v3/api-docs")
            || path.startsWith("/actuator/health")
            || path.startsWith("/api/v1/health");
    }
}
