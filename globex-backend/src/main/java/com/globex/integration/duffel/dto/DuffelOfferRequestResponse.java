package com.globex.integration.duffel.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * Raw Duffel API response from POST /air/offer_requests.
 * All fields use @JsonIgnoreProperties(ignoreUnknown=true) to avoid failures
 * when Duffel adds new fields to their response in future API versions.
 *
 * Do NOT use these DTOs as domain models or database entities.
 * Convert to FlightOffer via DuffelFlightMapper.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record DuffelOfferRequestResponse(
    @JsonProperty("data") DuffelOfferRequest data
) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record DuffelOfferRequest(
        @JsonProperty("id") String id,
        @JsonProperty("offers") List<DuffelOffer> offers,
        @JsonProperty("cabin_class") String cabinClass,
        @JsonProperty("slices") List<DuffelSlice> slices,
        @JsonProperty("passengers") List<DuffelPassenger> passengers
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record DuffelOffer(
        @JsonProperty("id") String id,
        @JsonProperty("total_amount") String totalAmount,
        @JsonProperty("total_currency") String totalCurrency,
        @JsonProperty("base_amount") String baseAmount,
        @JsonProperty("base_currency") String baseCurrency,
        @JsonProperty("tax_amount") String taxAmount,
        @JsonProperty("tax_currency") String taxCurrency,
        @JsonProperty("owner") DuffelCarrier owner,
        @JsonProperty("slices") List<DuffelSlice> slices,
        @JsonProperty("passengers") List<DuffelOfferPassenger> passengers,
        @JsonProperty("cabin_class") String cabinClass,
        @JsonProperty("conditions") DuffelConditions conditions,
        @JsonProperty("expires_at") String expiresAt,
        @JsonProperty("created_at") String createdAt,
        @JsonProperty("updated_at") String updatedAt
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record DuffelSlice(
        @JsonProperty("id") String id,
        @JsonProperty("origin") DuffelLocation origin,
        @JsonProperty("destination") DuffelLocation destination,
        @JsonProperty("duration") String duration,     // ISO 8601 duration e.g. "PT7H30M"
        @JsonProperty("segments") List<DuffelSegment> segments
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record DuffelSegment(
        @JsonProperty("id") String id,
        @JsonProperty("origin") DuffelLocation origin,
        @JsonProperty("destination") DuffelLocation destination,
        @JsonProperty("departing_at") String departingAt,    // ISO 8601 e.g. "2026-10-15T08:00:00"
        @JsonProperty("arriving_at") String arrivingAt,
        @JsonProperty("duration") String duration,
        @JsonProperty("operating_carrier") DuffelCarrier operatingCarrier,
        @JsonProperty("marketing_carrier") DuffelCarrier marketingCarrier,
        @JsonProperty("marketing_carrier_flight_number") String flightNumber,
        @JsonProperty("aircraft") DuffelAircraft aircraft,
        @JsonProperty("passengers") List<DuffelSegmentPassenger> passengers
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record DuffelLocation(
        @JsonProperty("id") String id,
        @JsonProperty("iata_code") String iataCode,
        @JsonProperty("name") String name,
        @JsonProperty("city_name") String cityName,
        @JsonProperty("country") DuffelCountry country,
        @JsonProperty("latitude") Double latitude,
        @JsonProperty("longitude") Double longitude,
        @JsonProperty("type") String type              // "airport" or "city"
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record DuffelCountry(
        @JsonProperty("iso_code") String isoCode,
        @JsonProperty("name") String name
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record DuffelCarrier(
        @JsonProperty("id") String id,
        @JsonProperty("iata_code") String iataCode,
        @JsonProperty("name") String name,
        @JsonProperty("logo_symbol_url") String logoSymbolUrl,
        @JsonProperty("logo_lockup_url") String logoLockupUrl
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record DuffelAircraft(
        @JsonProperty("id") String id,
        @JsonProperty("iata_code") String iataCode,
        @JsonProperty("name") String name
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record DuffelPassenger(
        @JsonProperty("id") String id,
        @JsonProperty("type") String type              // "adult", "child", "infant_without_seat"
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record DuffelOfferPassenger(
        @JsonProperty("passenger_id") String passengerId,
        @JsonProperty("cabin_class") String cabinClass,
        @JsonProperty("cabin_class_marketing_name") String cabinClassMarketingName,
        @JsonProperty("baggages") List<DuffelBaggage> baggages
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record DuffelBaggage(
        @JsonProperty("quantity") int quantity,
        @JsonProperty("type") String type              // "checked", "carry_on"
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record DuffelSegmentPassenger(
        @JsonProperty("passenger_id") String passengerId,
        @JsonProperty("cabin_class") String cabinClass,
        @JsonProperty("cabin_class_marketing_name") String cabinClassMarketingName
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record DuffelConditions(
        @JsonProperty("refund_before_departure") DuffelCondition refundBeforeDeparture,
        @JsonProperty("change_before_departure") DuffelCondition changeBeforeDeparture
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record DuffelCondition(
        @JsonProperty("allowed") Boolean allowed,
        @JsonProperty("penalty_amount") String penaltyAmount,
        @JsonProperty("penalty_currency") String penaltyCurrency
    ) {}
}
