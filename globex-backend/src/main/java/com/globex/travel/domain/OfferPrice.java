package com.globex.travel.domain;

import java.math.BigDecimal;

/**
 * Normalized price model shared across Flight, Hotel, and Activity offers.
 * Amount is the raw provider price in the provider's currency.
 * Currency is ISO 4217 code (e.g. GBP, USD, EUR).
 */
public record OfferPrice(BigDecimal amount, String currency) {

    public static OfferPrice of(String amount, String currency) {
        return new OfferPrice(
            amount != null ? new BigDecimal(amount) : BigDecimal.ZERO,
            currency != null ? currency : "USD"
        );
    }
}
