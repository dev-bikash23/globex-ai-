package com.globex.integration.currency;

import com.globex.integration.currency.dto.external.FrankfurterRatesResponse;
import com.globex.shared.config.GlobexProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;
import java.util.Optional;

@Component
public class CurrencyClient {
    private static final Logger log = LoggerFactory.getLogger(CurrencyClient.class);

    private final RestClient restClient;
    private final GlobexProperties properties;

    public CurrencyClient(RestClient.Builder restClientBuilder, GlobexProperties properties) {
        this.properties = properties;
        this.restClient = restClientBuilder
                .baseUrl(properties.getIntegration().getCurrency().getBaseUrl())
                .build();
    }

    public Optional<FrankfurterRatesResponse> fetchRates(String from, String to) {
        try {
            log.debug("Calling Frankfurter API for base={}, to={}", from, to);
            FrankfurterRatesResponse response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/latest")
                            .queryParam("base", from.toUpperCase())
                            .queryParam("symbols", to.toUpperCase())
                            .build())
                    .retrieve()
                    .body(FrankfurterRatesResponse.class);

            return Optional.ofNullable(response);
        } catch (Exception e) {
            log.error("Failed to fetch exchange rates from Frankfurter: from={}, to={}, err={}", from, to, e.getMessage());
            return Optional.empty();
        }
    }

    public Optional<Map<String, String>> fetchCurrencies() {
        try {
            log.debug("Calling Frankfurter /currencies");
            Map<String, String> currencies = restClient.get()
                    .uri("/currencies")
                    .retrieve()
                    .body(new ParameterizedTypeReference<Map<String, String>>() {});

            return Optional.ofNullable(currencies);
        } catch (Exception e) {
            log.error("Failed to fetch currencies list: {}", e.getMessage());
            return Optional.empty();
        }
    }
}
