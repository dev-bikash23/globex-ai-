package com.globex.shared.config;

import java.util.List;

/**
 * Type-safe configuration properties for GlobeX application settings.
 * Binds all "globex.*" YAML properties to this class.
 * Values come from application.yml → environment variables.
 */
public class GlobexProperties {

    private Jwt jwt = new Jwt();
    private Cors cors = new Cors();
    private RateLimit rateLimit = new RateLimit();
    private App app = new App();
    private Email email = new Email();
    private Redis redis = new Redis();
    private Integration integration = new Integration();

    public Jwt getJwt()             { return jwt; }
    public void setJwt(Jwt jwt)     { this.jwt = jwt; }

    public Cors getCors()               { return cors; }
    public void setCors(Cors cors)      { this.cors = cors; }

    public RateLimit getRateLimit()                  { return rateLimit; }
    public void setRateLimit(RateLimit rateLimit)    { this.rateLimit = rateLimit; }

    public App getApp()             { return app; }
    public void setApp(App app)     { this.app = app; }

    public Email getEmail()             { return email; }
    public void setEmail(Email email)   { this.email = email; }

    public Redis getRedis()             { return redis; }
    public void setRedis(Redis redis)   { this.redis = redis; }

    public Integration getIntegration()                 { return integration; }
    public void setIntegration(Integration integration) { this.integration = integration; }

    // ── Nested config classes ─────────────────────────────────────────────────

    public static class Jwt {
        private String secret;
        private int accessTokenExpiryMinutes = 15;
        private int refreshTokenExpiryDays = 30;

        public String getSecret()                           { return secret; }
        public void setSecret(String secret)                { this.secret = secret; }
        public int getAccessTokenExpiryMinutes()            { return accessTokenExpiryMinutes; }
        public void setAccessTokenExpiryMinutes(int v)      { this.accessTokenExpiryMinutes = v; }
        public int getRefreshTokenExpiryDays()              { return refreshTokenExpiryDays; }
        public void setRefreshTokenExpiryDays(int v)        { this.refreshTokenExpiryDays = v; }
    }

    public static class Cors {
        private List<String> allowedOrigins = List.of("http://localhost:5173");

        public List<String> getAllowedOrigins()                     { return allowedOrigins; }
        public void setAllowedOrigins(List<String> allowedOrigins)  { this.allowedOrigins = allowedOrigins; }
    }

    public static class RateLimit {
        private Login login = new Login();

        public Login getLogin()             { return login; }
        public void setLogin(Login login)   { this.login = login; }

        public static class Login {
            private int capacity = 5;
            private int refillMinutes = 15;

            public int getCapacity()                { return capacity; }
            public void setCapacity(int capacity)   { this.capacity = capacity; }
            public int getRefillMinutes()           { return refillMinutes; }
            public void setRefillMinutes(int v)     { this.refillMinutes = v; }
        }
    }

    public static class App {
        private String baseUrl = "http://localhost:8080";
        private String frontendUrl = "http://localhost:5173";

        public String getBaseUrl()              { return baseUrl; }
        public void setBaseUrl(String baseUrl)  { this.baseUrl = baseUrl; }
        public String getFrontendUrl()                  { return frontendUrl; }
        public void setFrontendUrl(String frontendUrl)  { this.frontendUrl = frontendUrl; }
    }

    public static class Email {
        private int verificationExpiryHours = 24;
        private int passwordResetExpiryHours = 2;

        public int getVerificationExpiryHours()         { return verificationExpiryHours; }
        public void setVerificationExpiryHours(int v)   { this.verificationExpiryHours = v; }
        public int getPasswordResetExpiryHours()        { return passwordResetExpiryHours; }
        public void setPasswordResetExpiryHours(int v)  { this.passwordResetExpiryHours = v; }
    }

    public static class Redis {
        private String keyPrefix = "globex:";
        private String tokenBlocklistPrefix = "globex:token:blocklist:";
        private String rateLimitPrefix = "globex:ratelimit:";
        private String cachePrefix = "globex:cache:";

        public String getKeyPrefix()                        { return keyPrefix; }
        public void setKeyPrefix(String keyPrefix)          { this.keyPrefix = keyPrefix; }
        public String getTokenBlocklistPrefix()             { return tokenBlocklistPrefix; }
        public void setTokenBlocklistPrefix(String v)       { this.tokenBlocklistPrefix = v; }
        public String getRateLimitPrefix()                  { return rateLimitPrefix; }
        public void setRateLimitPrefix(String v)            { this.rateLimitPrefix = v; }
        public String getCachePrefix()                      { return cachePrefix; }
        public void setCachePrefix(String v)                { this.cachePrefix = v; }
    }

    public static class Integration {
        private Weather weather = new Weather();
        private Currency currency = new Currency();
        private Places places = new Places();
        private Images images = new Images();
        private Geocoding geocoding = new Geocoding();
        private Duffel duffel = new Duffel();

        public Weather getWeather() { return weather; }
        public void setWeather(Weather weather) { this.weather = weather; }

        public Currency getCurrency() { return currency; }
        public void setCurrency(Currency currency) { this.currency = currency; }

        public Places getPlaces() { return places; }
        public void setPlaces(Places places) { this.places = places; }

        public Images getImages() { return images; }
        public void setImages(Images images) { this.images = images; }

        public Geocoding getGeocoding() { return geocoding; }
        public void setGeocoding(Geocoding geocoding) { this.geocoding = geocoding; }

        public Duffel getDuffel() { return duffel; }
        public void setDuffel(Duffel duffel) { this.duffel = duffel; }

        public static class Weather {
            private String provider = "open-meteo";
            private String baseUrl = "https://api.open-meteo.com/v1";
            private int connectTimeoutMs = 5000;
            private int readTimeoutMs = 10000;
            private int currentTtlMinutes = 10;
            private int forecastTtlMinutes = 30;

            public String getProvider() { return provider; }
            public void setProvider(String provider) { this.provider = provider; }
            public String getBaseUrl() { return baseUrl; }
            public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }
            public int getConnectTimeoutMs() { return connectTimeoutMs; }
            public void setConnectTimeoutMs(int connectTimeoutMs) { this.connectTimeoutMs = connectTimeoutMs; }
            public int getReadTimeoutMs() { return readTimeoutMs; }
            public void setReadTimeoutMs(int readTimeoutMs) { this.readTimeoutMs = readTimeoutMs; }
            public int getCurrentTtlMinutes() { return currentTtlMinutes; }
            public void setCurrentTtlMinutes(int currentTtlMinutes) { this.currentTtlMinutes = currentTtlMinutes; }
            public int getForecastTtlMinutes() { return forecastTtlMinutes; }
            public void setForecastTtlMinutes(int forecastTtlMinutes) { this.forecastTtlMinutes = forecastTtlMinutes; }
        }

        public static class Currency {
            private String provider = "frankfurter";
            private String baseUrl = "https://api.frankfurter.app";
            private int connectTimeoutMs = 5000;
            private int readTimeoutMs = 8000;
            private int ratesTtlHours = 6;

            public String getProvider() { return provider; }
            public void setProvider(String provider) { this.provider = provider; }
            public String getBaseUrl() { return baseUrl; }
            public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }
            public int getConnectTimeoutMs() { return connectTimeoutMs; }
            public void setConnectTimeoutMs(int connectTimeoutMs) { this.connectTimeoutMs = connectTimeoutMs; }
            public int getReadTimeoutMs() { return readTimeoutMs; }
            public void setReadTimeoutMs(int readTimeoutMs) { this.readTimeoutMs = readTimeoutMs; }
            public int getRatesTtlHours() { return ratesTtlHours; }
            public void setRatesTtlHours(int ratesTtlHours) { this.ratesTtlHours = ratesTtlHours; }
        }

        public static class Places {
            private String provider = "overpass";
            private String baseUrl = "https://overpass-api.de/api/interpreter";
            private int connectTimeoutMs = 8000;
            private int readTimeoutMs = 30000;
            private int placesTtlHours = 24;
            private int defaultRadiusMeters = 3000;
            private int maxResults = 20;

            public String getProvider() { return provider; }
            public void setProvider(String provider) { this.provider = provider; }
            public String getBaseUrl() { return baseUrl; }
            public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }
            public int getConnectTimeoutMs() { return connectTimeoutMs; }
            public void setConnectTimeoutMs(int connectTimeoutMs) { this.connectTimeoutMs = connectTimeoutMs; }
            public int getReadTimeoutMs() { return readTimeoutMs; }
            public void setReadTimeoutMs(int readTimeoutMs) { this.readTimeoutMs = readTimeoutMs; }
            public int getPlacesTtlHours() { return placesTtlHours; }
            public void setPlacesTtlHours(int placesTtlHours) { this.placesTtlHours = placesTtlHours; }
            public int getDefaultRadiusMeters() { return defaultRadiusMeters; }
            public void setDefaultRadiusMeters(int defaultRadiusMeters) { this.defaultRadiusMeters = defaultRadiusMeters; }
            public int getMaxResults() { return maxResults; }
            public void setMaxResults(int maxResults) { this.maxResults = maxResults; }
        }

        public static class Images {
            private String provider = "mock";
            private String accessKey = "";
            private String baseUrl = "https://api.unsplash.com";
            private int connectTimeoutMs = 5000;
            private int readTimeoutMs = 10000;
            private int imagesTtlHours = 6;
            private String utmSource = "globex_ai";

            public String getProvider() { return provider; }
            public void setProvider(String provider) { this.provider = provider; }
            public String getAccessKey() { return accessKey; }
            public void setAccessKey(String accessKey) { this.accessKey = accessKey; }
            public String getBaseUrl() { return baseUrl; }
            public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }
            public int getConnectTimeoutMs() { return connectTimeoutMs; }
            public void setConnectTimeoutMs(int connectTimeoutMs) { this.connectTimeoutMs = connectTimeoutMs; }
            public int getReadTimeoutMs() { return readTimeoutMs; }
            public void setReadTimeoutMs(int readTimeoutMs) { this.readTimeoutMs = readTimeoutMs; }
            public int getImagesTtlHours() { return imagesTtlHours; }
            public void setImagesTtlHours(int imagesTtlHours) { this.imagesTtlHours = imagesTtlHours; }
            public String getUtmSource() { return utmSource; }
            public void setUtmSource(String utmSource) { this.utmSource = utmSource; }
        }

        public static class Duffel {
            private String apiToken = "";
            private String baseUrl = "https://api.duffel.com";
            private String apiVersion = "v2";
            private int connectTimeoutMs = 10000;
            private int readTimeoutMs = 30000;
            private int flightOfferTtlMinutes = 5;   // Offers expire fast — short cache only
            private int maxOffersToReturn = 50;       // Limit offers per search

            public String getApiToken() { return apiToken; }
            public void setApiToken(String apiToken) { this.apiToken = apiToken; }
            public String getBaseUrl() { return baseUrl; }
            public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }
            public String getApiVersion() { return apiVersion; }
            public void setApiVersion(String apiVersion) { this.apiVersion = apiVersion; }
            public int getConnectTimeoutMs() { return connectTimeoutMs; }
            public void setConnectTimeoutMs(int connectTimeoutMs) { this.connectTimeoutMs = connectTimeoutMs; }
            public int getReadTimeoutMs() { return readTimeoutMs; }
            public void setReadTimeoutMs(int readTimeoutMs) { this.readTimeoutMs = readTimeoutMs; }
            public int getFlightOfferTtlMinutes() { return flightOfferTtlMinutes; }
            public void setFlightOfferTtlMinutes(int flightOfferTtlMinutes) { this.flightOfferTtlMinutes = flightOfferTtlMinutes; }
            public int getMaxOffersToReturn() { return maxOffersToReturn; }
            public void setMaxOffersToReturn(int maxOffersToReturn) { this.maxOffersToReturn = maxOffersToReturn; }
        }

        public static class Geocoding {
            private String provider = "nominatim";
            private String baseUrl = "https://nominatim.openstreetmap.org";
            private int connectTimeoutMs = 5000;
            private int readTimeoutMs = 10000;
            private String userAgent = "GlobeX-AI/1.0 (portfolio; dev@globex.ai)";
            private int ttlDays = 7;

            public String getProvider() { return provider; }
            public void setProvider(String provider) { this.provider = provider; }
            public String getBaseUrl() { return baseUrl; }
            public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }
            public int getConnectTimeoutMs() { return connectTimeoutMs; }
            public void setConnectTimeoutMs(int connectTimeoutMs) { this.connectTimeoutMs = connectTimeoutMs; }
            public int getReadTimeoutMs() { return readTimeoutMs; }
            public void setReadTimeoutMs(int readTimeoutMs) { this.readTimeoutMs = readTimeoutMs; }
            public String getUserAgent() { return userAgent; }
            public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
            public int getTtlDays() { return ttlDays; }
            public void setTtlDays(int ttlDays) { this.ttlDays = ttlDays; }
        }
    }
}
