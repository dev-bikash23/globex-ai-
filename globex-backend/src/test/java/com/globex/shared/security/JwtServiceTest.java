package com.globex.shared.security;

import com.globex.shared.config.GlobexProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Unit test for JwtService.
 *
 * <h2>Java Concept — Unit Test:</h2>
 * Tests JwtService in complete isolation — no Spring context, no database.
 * We instantiate JwtService directly and control all its dependencies.
 *
 * <h2>Java Concept — AssertJ:</h2>
 * assertThat(value).isNotNull().isEqualTo(expected)
 * More readable than JUnit assertEquals(expected, actual).
 */
@DisplayName("JwtService Unit Tests")
class JwtServiceTest {

    private JwtService jwtService;
    private UserDetails testUser;

    @BeforeEach
    void setUp() {
        // Set up properties manually — no Spring context needed
        GlobexProperties props = new GlobexProperties();
        GlobexProperties.Jwt jwt = new GlobexProperties.Jwt();
        jwt.setSecret("TestSecretKeyForJWTThatIsAtLeast256BitsLongForHMACSHA256AlgorithmPlus");
        jwt.setAccessTokenExpiryMinutes(15);
        jwt.setRefreshTokenExpiryDays(30);
        props.setJwt(jwt);

        jwtService = new JwtService(props);

        testUser = User.withUsername("test@globex.com")
                .password("hashed_password")
                .authorities(Collections.emptyList())
                .build();
    }

    @Test
    @DisplayName("Should generate a non-null access token")
    void shouldGenerateAccessToken() {
        String token = jwtService.generateAccessToken(testUser);
        assertThat(token).isNotNull().isNotBlank();
    }

    @Test
    @DisplayName("Generated token should contain the correct username")
    void shouldExtractCorrectUsername() {
        String token = jwtService.generateAccessToken(testUser);
        String username = jwtService.extractUsername(token);
        assertThat(username).isEqualTo("test@globex.com");
    }

    @Test
    @DisplayName("Token should be valid for the correct user")
    void shouldValidateTokenForCorrectUser() {
        String token = jwtService.generateAccessToken(testUser);
        boolean valid = jwtService.isTokenValid(token, testUser);
        assertThat(valid).isTrue();
    }

    @Test
    @DisplayName("Token should be invalid for a different user")
    void shouldRejectTokenForWrongUser() {
        String token = jwtService.generateAccessToken(testUser);

        UserDetails otherUser = User.withUsername("other@globex.com")
                .password("hashed_password")
                .authorities(Collections.emptyList())
                .build();

        boolean valid = jwtService.isTokenValid(token, otherUser);
        assertThat(valid).isFalse();
    }

    @Test
    @DisplayName("Token should not be expired immediately after generation")
    void shouldNotBeExpiredImmediately() {
        String token = jwtService.generateAccessToken(testUser);
        assertThat(jwtService.isTokenExpired(token)).isFalse();
    }

    @Test
    @DisplayName("Each token should have a unique JTI")
    void shouldGenerateUniqueJti() {
        String token1 = jwtService.generateAccessToken(testUser);
        String token2 = jwtService.generateAccessToken(testUser);

        String jti1 = jwtService.extractJti(token1);
        String jti2 = jwtService.extractJti(token2);

        assertThat(jti1).isNotEqualTo(jti2);
    }

    @Test
    @DisplayName("JTI should not be null")
    void shouldHaveNonNullJti() {
        String token = jwtService.generateAccessToken(testUser);
        String jti = jwtService.extractJti(token);
        assertThat(jti).isNotNull().isNotBlank();
    }
}
