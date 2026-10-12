package com.globex.integration.duffel;

import com.globex.integration.duffel.dto.DuffelOfferRequestResponse;
import com.globex.integration.duffel.dto.DuffelOfferRequestResponse.*;
import com.globex.shared.config.GlobexProperties;
import com.globex.shared.exception.ProviderUnavailableException;
import com.globex.travel.domain.FlightOffer;
import com.globex.travel.domain.FlightSegment;
import com.globex.travel.domain.OfferPrice;
import com.globex.travel.flight.dto.FlightSearchRequest;
import com.globex.travel.flight.provider.FlightProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Duffel implementation of FlightProvider.
 *
 * Translates FlightSearchRequest → Duffel API call → List<FlightOffer>.
 * All Duffel-specific logic is contained here.
 * FlightService knows nothing about Duffel.
 *
 * Duffel API flow:
 *  POST /air/offer_requests → returns offers inline in response.
 *  Single HTTP call returns all available offers for the route/dates.
 *
 * Test mode: Token starts with "duffel_test_". Offers use "Duffel Airways".
 * All test offers have isTestData=true, shown as a badge in the UI.
 */
@Component
public class DuffelFlightProvider implements FlightProvider {

    private static final Logger log = LoggerFactory.getLogger(DuffelFlightProvider.class);

    private final DuffelClient duffelClient;
    private final GlobexProperties.Integration.Duffel config;

    public DuffelFlightProvider(DuffelClient duffelClient, GlobexProperties properties) {
        this.duffelClient = duffelClient;
        this.config = properties.getIntegration().getDuffel();
    }

    @Override
    public String providerName() {
        return "duffel";
    }

    @Override
    public boolean isTestMode() {
        return duffelClient.isTestMode();
    }

    @Override
    public List<FlightOffer> searchFlights(FlightSearchRequest request) {
        if (!duffelClient.isConfigured()) {
            log.warn("[DuffelFlightProvider] API token not configured. Returning empty results.");
            return Collections.emptyList();
        }

        log.info("[DuffelFlightProvider] Searching flights: {} → {} on {} (adults:{}, cabin:{})",
            request.origin(), request.destination(), request.departureDate(),
            request.adults(), request.cabinClass());

        Map<String, Object> body = buildRequestBody(request);

        try {
            DuffelOfferRequestResponse response = duffelClient.postOfferRequest(body);

            if (response == null || response.data() == null ||
                response.data().offers() == null || response.data().offers().isEmpty()) {
                log.info("[DuffelFlightProvider] No offers returned for {}->{}", request.origin(), request.destination());
                return Collections.emptyList();
            }

            List<DuffelOffer> rawOffers = response.data().offers();
            log.info("[DuffelFlightProvider] Received {} raw offers, limiting to {}",
                rawOffers.size(), config.getMaxOffersToReturn());

            return rawOffers.stream()
                .limit(config.getMaxOffersToReturn())
                .map(offer -> normalizeOffer(offer, request.isRoundTrip()))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        } catch (ProviderUnavailableException e) {
            throw e;
        } catch (Exception e) {
            log.error("[DuffelFlightProvider] Unexpected error: {}", e.getMessage(), e);
            throw new ProviderUnavailableException("duffel",
                "Flight search is temporarily unavailable. Please try again.", e);
        }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Private: Build Duffel API request body
    // ──────────────────────────────────────────────────────────────────────────

    private Map<String, Object> buildRequestBody(FlightSearchRequest request) {
        List<Map<String, Object>> slices = new ArrayList<>();

        // Outbound slice
        Map<String, Object> outbound = new LinkedHashMap<>();
        outbound.put("origin", request.origin().toUpperCase());
        outbound.put("destination", request.destination().toUpperCase());
        outbound.put("departure_date", request.departureDate().toString());
        slices.add(outbound);

        // Return slice (round-trip)
        if (request.isRoundTrip() && request.returnDate() != null) {
            Map<String, Object> returnSlice = new LinkedHashMap<>();
            returnSlice.put("origin", request.destination().toUpperCase());
            returnSlice.put("destination", request.origin().toUpperCase());
            returnSlice.put("departure_date", request.returnDate().toString());
            slices.add(returnSlice);
        }

        // Passengers
        List<Map<String, Object>> passengers = new ArrayList<>();
        for (int i = 0; i < request.adults(); i++) {
            passengers.add(Map.of("type", "adult"));
        }
        for (int i = 0; i < request.children(); i++) {
            passengers.add(Map.of("type", "child"));
        }
        for (int i = 0; i < request.infants(); i++) {
            passengers.add(Map.of("type", "infant_without_seat"));
        }

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("slices", slices);
        data.put("passengers", passengers);
        data.put("cabin_class", mapCabinClass(request.cabinClass()));

        return Map.of("data", data);
    }

    private String mapCabinClass(String cabinClass) {
        if (cabinClass == null || cabinClass.isBlank()) return "economy";
        return switch (cabinClass.toUpperCase()) {
            case "ECONOMY"          -> "economy";
            case "PREMIUM_ECONOMY"  -> "premium_economy";
            case "BUSINESS"         -> "business";
            case "FIRST"            -> "first";
            default                 -> "economy";
        };
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Private: Normalize Duffel offer → FlightOffer
    // ──────────────────────────────────────────────────────────────────────────

    private FlightOffer normalizeOffer(DuffelOffer raw, boolean isRoundTrip) {
        try {
            if (raw.slices() == null || raw.slices().isEmpty()) return null;

            // Get outbound and return slices
            DuffelSlice outboundSlice = raw.slices().get(0);
            DuffelSlice returnSlice = (isRoundTrip && raw.slices().size() > 1)
                ? raw.slices().get(1) : null;

            // Airline info from owner
            String airline = raw.owner() != null ? raw.owner().name() : "Unknown Airline";
            String airlineCode = raw.owner() != null ? raw.owner().iataCode() : "??";
            String logoUrl = raw.owner() != null ? raw.owner().logoSymbolUrl() : null;

            // Price
            OfferPrice totalPrice = OfferPrice.of(raw.totalAmount(), raw.totalCurrency());
            OfferPrice baseFare = OfferPrice.of(raw.baseAmount(), raw.baseCurrency());
            OfferPrice taxAmount = OfferPrice.of(raw.taxAmount(), raw.taxCurrency());

            // Cabin class
            String cabinClass = normalizeCabinClassDisplay(raw.cabinClass());

            // Segments
            List<FlightSegment> outboundSegments = normalizeSegments(outboundSlice);
            List<FlightSegment> returnSegments = returnSlice != null
                ? normalizeSegments(returnSlice) : null;

            // Total stops (across all outbound segments)
            int stops = Math.max(0, outboundSegments.size() - 1);

            // Total duration (outbound slice)
            int totalDurationMinutes = parseDurationToMinutes(outboundSlice.duration());

            // Conditions
            boolean refundable = false;
            boolean changeable = false;
            String conditions = "Standard fare conditions apply.";
            if (raw.conditions() != null) {
                if (raw.conditions().refundBeforeDeparture() != null) {
                    refundable = Boolean.TRUE.equals(raw.conditions().refundBeforeDeparture().allowed());
                }
                if (raw.conditions().changeBeforeDeparture() != null) {
                    changeable = Boolean.TRUE.equals(raw.conditions().changeBeforeDeparture().allowed());
                }
                conditions = buildConditionsText(raw.conditions(), refundable, changeable);
            }

            // Baggage
            String baggageAllowance = extractBaggageInfo(raw.passengers());

            return new FlightOffer(
                raw.id(),
                "duffel",
                airline,
                airlineCode,
                logoUrl,
                totalPrice,
                baseFare,
                taxAmount,
                cabinClass,
                cabinClass,
                stops,
                totalDurationMinutes,
                outboundSegments,
                returnSegments,
                baggageAllowance,
                refundable,
                changeable,
                conditions,
                Instant.now(),
                duffelClient.isTestMode()
            );

        } catch (Exception e) {
            log.warn("[DuffelFlightProvider] Failed to normalize offer {}: {}", raw.id(), e.getMessage());
            return null;
        }
    }

    private List<FlightSegment> normalizeSegments(DuffelSlice slice) {
        if (slice == null || slice.segments() == null) return Collections.emptyList();

        return slice.segments().stream().map(seg -> {
            String depCode = seg.origin() != null ? seg.origin().iataCode() : "";
            String depName = seg.origin() != null ? seg.origin().name() : "";
            String depCity = seg.origin() != null ? seg.origin().cityName() : "";
            String arrCode = seg.destination() != null ? seg.destination().iataCode() : "";
            String arrName = seg.destination() != null ? seg.destination().name() : "";
            String arrCity = seg.destination() != null ? seg.destination().cityName() : "";

            String airline = seg.operatingCarrier() != null ? seg.operatingCarrier().name() : "";
            String airlineCode = seg.operatingCarrier() != null ? seg.operatingCarrier().iataCode() : "";
            String aircraft = seg.aircraft() != null ? seg.aircraft().name() : null;
            int durationMins = parseDurationToMinutes(seg.duration());

            String flightNum = (airlineCode != null ? airlineCode : "") +
                (seg.flightNumber() != null ? seg.flightNumber() : "");

            return new FlightSegment(
                depCode, depName, depCity,
                arrCode, arrName, arrCity,
                seg.departingAt(), seg.arrivingAt(),
                durationMins, airline, airlineCode,
                flightNum, aircraft
            );
        }).collect(Collectors.toList());
    }

    private int parseDurationToMinutes(String isoDuration) {
        if (isoDuration == null || isoDuration.isBlank()) return 0;
        try {
            Duration d = Duration.parse(isoDuration);
            return (int) d.toMinutes();
        } catch (Exception e) {
            return 0;
        }
    }

    private String normalizeCabinClassDisplay(String raw) {
        if (raw == null) return "Economy";
        return switch (raw.toLowerCase()) {
            case "economy"          -> "Economy";
            case "premium_economy"  -> "Premium Economy";
            case "business"         -> "Business";
            case "first"            -> "First";
            default                 -> "Economy";
        };
    }

    private String buildConditionsText(DuffelConditions cond,
                                       boolean refundable, boolean changeable) {
        StringBuilder sb = new StringBuilder();
        if (refundable) {
            sb.append("Refundable");
            if (cond.refundBeforeDeparture() != null &&
                cond.refundBeforeDeparture().penaltyAmount() != null &&
                !cond.refundBeforeDeparture().penaltyAmount().equals("0.00")) {
                sb.append(" (penalty applies)");
            }
        } else {
            sb.append("Non-refundable");
        }
        sb.append(". ");
        if (changeable) sb.append("Date changes allowed.");
        else sb.append("No date changes.");
        return sb.toString();
    }

    private String extractBaggageInfo(List<DuffelOfferPassenger> passengers) {
        if (passengers == null || passengers.isEmpty()) return "Baggage information not available";
        DuffelOfferPassenger first = passengers.get(0);
        if (first.baggages() == null || first.baggages().isEmpty()) {
            return "Baggage information not available";
        }
        StringBuilder sb = new StringBuilder();
        for (var bag : first.baggages()) {
            if (bag.quantity() > 0) {
                sb.append(bag.quantity()).append("x ")
                  .append(bag.type().equals("checked") ? "checked bag" : "carry-on");
                sb.append(", ");
            }
        }
        String result = sb.toString();
        return result.isEmpty() ? "No checked baggage included"
            : result.substring(0, result.length() - 2);
    }
}
