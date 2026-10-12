package com.globex.integration.mock;

import com.globex.travel.domain.HotelOffer;
import com.globex.travel.domain.OfferPrice;
import com.globex.travel.hotel.dto.HotelSearchRequest;
import com.globex.travel.hotel.provider.HotelProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Demo hotel data provider — clearly labeled DEMO DATA in UI.
 *
 * WHY THIS EXISTS:
 * Real hotel APIs (Booking.com, Hotels.com, Expedia) require B2B commercial
 * agreements and partner vetting. No free self-service tier exists for portfolio use.
 * This mock provider demonstrates the provider abstraction pattern correctly.
 * When a real hotel API is integrated, only this class needs to be replaced.
 *
 * The FlightService, HotelController, and frontend do NOT change.
 * Architecture is provider-agnostic by design.
 *
 * DATA NOTICE: All hotel names, prices, and details shown here are for
 * demonstration purposes only. They do NOT represent real availability or pricing.
 */
@Component
public class MockHotelProvider implements HotelProvider {

    private static final Logger log = LoggerFactory.getLogger(MockHotelProvider.class);

    private static final String DEMO_NOTICE =
        "DEMO DATA — Hotel availability and prices shown are for demonstration purposes only. " +
        "Real hotel booking is not available in this version.";

    @Override
    public String providerName() { return "mock"; }

    @Override
    public boolean isTestMode() { return true; }

    @Override
    public List<HotelOffer> searchHotels(HotelSearchRequest request) {
        log.info("[MockHotelProvider] Returning demo hotels for: {}", request.destination());

        String dest = request.destination().toLowerCase();
        int nights = request.nights();
        if (nights <= 0) nights = 1;

        List<HotelOffer> hotels = generateHotels(dest, request, nights);

        // Apply star filter
        if (request.minStars() != null && request.minStars() > 0) {
            final int minStars = request.minStars();
            hotels = hotels.stream()
                .filter(h -> h.stars() >= minStars)
                .collect(Collectors.toList());
        }

        return hotels;
    }

    private List<HotelOffer> generateHotels(String destKey, HotelSearchRequest req, int nights) {
        List<RawHotel> templates = getHotelTemplates(destKey);
        List<HotelOffer> result = new ArrayList<>();

        for (RawHotel t : templates) {
            BigDecimal pricePerNight = t.basePrice;
            BigDecimal totalPrice = pricePerNight.multiply(BigDecimal.valueOf(nights));

            result.add(new HotelOffer(
                t.id,
                "mock",
                t.name,
                t.description,
                t.stars,
                t.guestRating,
                req.destination() + ", " + t.country,
                t.address,
                t.lat, t.lon,
                t.amenities,
                t.imageUrl,
                List.of(),
                t.roomType,
                new OfferPrice(pricePerNight, "USD"),
                new OfferPrice(totalPrice, "USD"),
                t.cancellation,
                t.freeCancellation,
                t.breakfastIncluded,
                req.checkIn() != null ? req.checkIn().toString() : "",
                req.checkOut() != null ? req.checkOut().toString() : "",
                nights,
                Instant.now(),
                true
            ));
        }
        return result;
    }

    // ── Demo hotel templates ──────────────────────────────────────────────────

    private List<RawHotel> getHotelTemplates(String destKey) {
        if (destKey.contains("london") || destKey.contains("lhr") || destKey.contains("lon")) {
            return londonHotels();
        } else if (destKey.contains("paris") || destKey.contains("cdg") || destKey.contains("par")) {
            return parisHotels();
        } else if (destKey.contains("new york") || destKey.contains("jfk") || destKey.contains("nyc")) {
            return newYorkHotels();
        } else if (destKey.contains("tokyo") || destKey.contains("nrt") || destKey.contains("hnd")) {
            return tokyoHotels();
        } else if (destKey.contains("dubai") || destKey.contains("dxb")) {
            return dubaiHotels();
        } else if (destKey.contains("delhi") || destKey.contains("del") || destKey.contains("india")) {
            return delhiHotels();
        } else if (destKey.contains("mumbai") || destKey.contains("bom")) {
            return mumbaiHotels();
        } else if (destKey.contains("singapore") || destKey.contains("sin")) {
            return singaporeHotels();
        } else if (destKey.contains("bali") || destKey.contains("dps")) {
            return baliHotels();
        } else {
            return genericHotels(destKey);
        }
    }

    private List<RawHotel> londonHotels() {
        return List.of(
            new RawHotel("h_lon_1", "The Savoy London", "Iconic Art Deco luxury hotel on the Thames",
                5, 9.2, "Strand, London WC2R 0EU", "United Kingdom", 51.5101, -0.1208,
                new BigDecimal("380"), "Grand Deluxe Room",
                amenities("WIFI","POOL","SPA","GYM","RESTAURANT","BAR","CONCIERGE"),
                "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
                "Free cancellation up to 48 hours before check-in", true, false),
            new RawHotel("h_lon_2", "citizenM London Shoreditch", "Stylish affordable design hotel",
                4, 8.8, "7 Holywell Ln, London EC2A 3ET", "United Kingdom", 51.5231, -0.0785,
                new BigDecimal("145"), "Queen Room",
                amenities("WIFI","GYM","BAR","24H_CHECKIN"),
                "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400",
                "Non-refundable", false, false),
            new RawHotel("h_lon_3", "The Hoxton, Shoreditch", "Boutique hotel in trendy East London",
                4, 8.9, "81 Great Eastern St, London EC2A 3HU", "United Kingdom", 51.5242, -0.0807,
                new BigDecimal("175"), "Roomy Room",
                amenities("WIFI","RESTAURANT","BAR","GYM"),
                "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400",
                "Free cancellation up to 24 hours", true, true),
            new RawHotel("h_lon_4", "Marriott County Hall", "Landmark hotel with Thames views",
                5, 9.0, "London County Hall, Westminster Bridge Rd", "United Kingdom", 51.5013, -0.1194,
                new BigDecimal("295"), "Superior Room",
                amenities("WIFI","POOL","SPA","GYM","RESTAURANT"),
                "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400",
                "Free cancellation up to 72 hours", true, false),
            new RawHotel("h_lon_5", "Premier Inn London Waterloo", "Reliable budget hotel near South Bank",
                3, 8.1, "85-87 York Rd, London SE1 7NJ", "United Kingdom", 51.5034, -0.1119,
                new BigDecimal("89"), "Standard Room",
                amenities("WIFI","RESTAURANT"),
                "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400",
                "Non-refundable (flexible rate available)", false, false),
            new RawHotel("h_lon_6", "Ace Hotel London Shoreditch", "Rock and roll boutique hotel",
                4, 8.6, "100 Shoreditch High St, London E1 6JQ", "United Kingdom", 51.5249, -0.0782,
                new BigDecimal("220"), "Standard Queen Room",
                amenities("WIFI","GYM","BAR","RESTAURANT","ROOFTOP"),
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
                "Free cancellation up to 48 hours", true, false)
        );
    }

    private List<RawHotel> parisHotels() {
        return List.of(
            new RawHotel("h_par_1", "Hôtel Plaza Athénée", "Legendary palace hotel on Avenue Montaigne",
                5, 9.4, "25 Avenue Montaigne, 75008 Paris", "France", 48.8675, 2.3046,
                new BigDecimal("850"), "Deluxe Room",
                amenities("WIFI","SPA","RESTAURANT","BAR","CONCIERGE","VALET"),
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
                "Free cancellation up to 72 hours", true, true),
            new RawHotel("h_par_2", "Generator Paris", "Trendy hostel/hotel near Canal Saint-Martin",
                3, 8.3, "9-11 Place du Colonel Fabien, 75010 Paris", "France", 48.8748, 2.3679,
                new BigDecimal("65"), "Private Room",
                amenities("WIFI","BAR","RESTAURANT","TERRACE"),
                "https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=400",
                "Free cancellation up to 48 hours", true, false),
            new RawHotel("h_par_3", "Hôtel du Louvre", "Historic hotel facing the Louvre Museum",
                5, 9.1, "Place André Malraux, 75001 Paris", "France", 48.8634, 2.3383,
                new BigDecimal("420"), "Superior Room",
                amenities("WIFI","SPA","GYM","RESTAURANT","BAR"),
                "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400",
                "Free cancellation up to 48 hours", true, false),
            new RawHotel("h_par_4", "Mama Shelter Paris East", "Fun design hotel by Philippe Starck",
                4, 8.7, "109 Rue de Bagnolet, 75020 Paris", "France", 48.8572, 2.4015,
                new BigDecimal("140"), "Cozy Room",
                amenities("WIFI","RESTAURANT","BAR","ROOFTOP","GYM"),
                "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400",
                "Free cancellation up to 24 hours", true, false)
        );
    }

    private List<RawHotel> newYorkHotels() {
        return List.of(
            new RawHotel("h_nyc_1", "The Standard High Line", "Cool Meatpacking District hotel",
                5, 9.0, "848 Washington St, New York, NY 10014", "USA", 40.7420, -74.0048,
                new BigDecimal("380"), "Standard King Room",
                amenities("WIFI","POOL","SPA","GYM","RESTAURANT","BAR","ROOFTOP"),
                "https://images.unsplash.com/photo-1549294413-26f195200c16?w=400",
                "Free cancellation up to 48 hours", true, false),
            new RawHotel("h_nyc_2", "Pod 51 Hotel", "Compact smart rooms in Midtown",
                3, 8.4, "230 E 51st St, New York, NY 10022", "USA", 40.7551, -73.9706,
                new BigDecimal("120"), "Pod Room",
                amenities("WIFI","RESTAURANT","BAR","ROOFTOP"),
                "https://images.unsplash.com/photo-1626178793926-22b28830aa30?w=400",
                "Non-refundable", false, false),
            new RawHotel("h_nyc_3", "The Plaza Hotel", "Legendary landmark hotel on Central Park",
                5, 9.3, "768 5th Ave, New York, NY 10019", "USA", 40.7645, -73.9744,
                new BigDecimal("695"), "Deluxe Room",
                amenities("WIFI","SPA","GYM","RESTAURANT","BAR","CONCIERGE"),
                "https://images.unsplash.com/photo-1455587734955-081b22074882?w=400",
                "Free cancellation up to 72 hours", true, true),
            new RawHotel("h_nyc_4", "YOTEL New York", "Smart micro-hotel near Times Square",
                4, 8.6, "570 10th Ave, New York, NY 10036", "USA", 40.7602, -74.0006,
                new BigDecimal("165"), "Premium Cabin",
                amenities("WIFI","GYM","BAR","TERRACE"),
                "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400",
                "Free cancellation up to 48 hours", true, false)
        );
    }

    private List<RawHotel> tokyoHotels() {
        return List.of(
            new RawHotel("h_tyo_1", "Park Hyatt Tokyo", "Luxury hotel immortalized in Lost in Translation",
                5, 9.5, "3-7-1-2 Nishi-Shinjuku, Shinjuku, Tokyo", "Japan", 35.6876, 139.6910,
                new BigDecimal("520"), "Park Deluxe King Room",
                amenities("WIFI","POOL","SPA","GYM","RESTAURANT","BAR"),
                "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400",
                "Free cancellation up to 72 hours", true, true),
            new RawHotel("h_tyo_2", "Shibuya Stream Excel Hotel Tokyu", "Modern hotel at Shibuya Stream",
                4, 8.8, "3-21-3 Shibuya, Shibuya-ku, Tokyo", "Japan", 35.6567, 139.7024,
                new BigDecimal("185"), "Standard Room",
                amenities("WIFI","GYM","RESTAURANT","BAR"),
                "https://images.unsplash.com/photo-1553653924-39b70295f8da?w=400",
                "Free cancellation up to 48 hours", true, false),
            new RawHotel("h_tyo_3", "Capsule Hotel Anshin Oyado Shinjuku", "Authentic Japanese capsule hotel",
                2, 8.0, "3-35-15 Shinjuku, Shinjuku-ku, Tokyo", "Japan", 35.6934, 139.7003,
                new BigDecimal("45"), "Capsule",
                amenities("WIFI","ONSEN","SAUNA"),
                "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400",
                "Non-refundable", false, false)
        );
    }

    private List<RawHotel> dubaiHotels() {
        return List.of(
            new RawHotel("h_dxb_1", "Burj Al Arab Jumeirah", "World's most iconic luxury hotel",
                5, 9.8, "Jumeirah St, Dubai", "UAE", 25.1413, 55.1853,
                new BigDecimal("1800"), "Deluxe Suite",
                amenities("WIFI","POOL","SPA","GYM","RESTAURANT","BAR","BEACH","HELIPAD"),
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400",
                "Free cancellation up to 7 days", true, true),
            new RawHotel("h_dxb_2", "Atlantis, The Palm", "Resort on the iconic Palm Jumeirah",
                5, 9.1, "Crescent Rd, Palm Jumeirah, Dubai", "UAE", 25.1300, 55.1173,
                new BigDecimal("420"), "King Room with Palm View",
                amenities("WIFI","WATERPARK","POOL","SPA","GYM","RESTAURANT","BEACH"),
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
                "Free cancellation up to 48 hours", true, true),
            new RawHotel("h_dxb_3", "Rove Downtown Dubai", "Modern lifestyle hotel near Dubai Mall",
                4, 8.5, "Al Asayel St, Downtown Dubai", "UAE", 25.1982, 55.2744,
                new BigDecimal("120"), "Standard Room",
                amenities("WIFI","POOL","GYM","RESTAURANT"),
                "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400",
                "Free cancellation up to 24 hours", true, false)
        );
    }

    private List<RawHotel> delhiHotels() {
        return List.of(
            new RawHotel("h_del_1", "The Imperial New Delhi", "Colonial-era grand luxury hotel",
                5, 9.2, "Janpath, New Delhi 110001", "India", 28.6265, 77.2218,
                new BigDecimal("220"), "Luxury Room",
                amenities("WIFI","POOL","SPA","GYM","RESTAURANT","BAR","CONCIERGE"),
                "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
                "Free cancellation up to 48 hours", true, true),
            new RawHotel("h_del_2", "Ibis New Delhi Aerocity", "Modern affordable hotel near airport",
                3, 8.3, "Asset 4, Hospitality District, Aerocity, New Delhi", "India", 28.5535, 77.0948,
                new BigDecimal("55"), "Standard Room",
                amenities("WIFI","RESTAURANT","GYM"),
                "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400",
                "Free cancellation up to 24 hours", true, false),
            new RawHotel("h_del_3", "Taj Mahal Hotel New Delhi", "Iconic 5-star on Mansingh Road",
                5, 9.4, "1, Mansingh Rd, New Delhi 110011", "India", 28.6010, 77.2215,
                new BigDecimal("280"), "Superior Room",
                amenities("WIFI","POOL","SPA","GYM","RESTAURANT","BAR"),
                "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400",
                "Free cancellation up to 48 hours", true, true),
            new RawHotel("h_del_4", "The Leela Palace New Delhi", "Ultra-luxury palace hotel",
                5, 9.6, "Africa Avenue, Chanakyapuri, New Delhi", "India", 28.5902, 77.1820,
                new BigDecimal("350"), "Deluxe Room",
                amenities("WIFI","POOL","SPA","GYM","RESTAURANT","BAR","BUTLER"),
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
                "Free cancellation up to 72 hours", true, true),
            new RawHotel("h_del_5", "Zostel Delhi", "Vibrant hostel in Paharganj area",
                2, 8.0, "5A, Arakashan Rd, Ram Nagar, New Delhi", "India", 28.6438, 77.2174,
                new BigDecimal("18"), "Dorm Bed",
                amenities("WIFI","COMMON_KITCHEN","TERRACE"),
                "https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=400",
                "Free cancellation up to 24 hours", true, false)
        );
    }

    private List<RawHotel> mumbaiHotels() {
        return List.of(
            new RawHotel("h_bom_1", "The Taj Mahal Palace Mumbai", "Heritage hotel overlooking the Gateway of India",
                5, 9.5, "Apollo Bunder, Colaba, Mumbai 400001", "India", 18.9217, 72.8332,
                new BigDecimal("380"), "Taj Club Room",
                amenities("WIFI","POOL","SPA","GYM","RESTAURANT","BAR","CONCIERGE"),
                "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400",
                "Free cancellation up to 72 hours", true, true),
            new RawHotel("h_bom_2", "Trident Nariman Point", "Business hotel with sea views",
                5, 9.0, "Nariman Point, Mumbai 400021", "India", 18.9254, 72.8238,
                new BigDecimal("180"), "Superior Room",
                amenities("WIFI","POOL","GYM","RESTAURANT","BAR"),
                "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400",
                "Free cancellation up to 48 hours", true, false),
            new RawHotel("h_bom_3", "Abode Bombay", "Boutique hotel in heritage Colaba building",
                4, 8.8, "Lansdowne House, Apollo Bunder, Colaba", "India", 18.9196, 72.8305,
                new BigDecimal("95"), "Deluxe Room",
                amenities("WIFI","RESTAURANT","BAR","TERRACE"),
                "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400",
                "Free cancellation up to 48 hours", true, true)
        );
    }

    private List<RawHotel> singaporeHotels() {
        return List.of(
            new RawHotel("h_sin_1", "Marina Bay Sands", "Iconic rooftop infinity pool hotel",
                5, 9.3, "10 Bayfront Ave, Singapore 018956", "Singapore", 1.2838, 103.8607,
                new BigDecimal("480"), "Deluxe Room",
                amenities("WIFI","INFINITY_POOL","SPA","GYM","RESTAURANT","CASINO","MALL"),
                "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400",
                "Free cancellation up to 72 hours", true, false),
            new RawHotel("h_sin_2", "Capsule Pod Boutique Hostel", "Modern capsule hotel",
                3, 8.5, "1 Dickson Rd, Singapore 209468", "Singapore", 1.3026, 103.8566,
                new BigDecimal("55"), "Capsule Pod",
                amenities("WIFI","ROOFTOP","BAR"),
                "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400",
                "Free cancellation up to 24 hours", true, false)
        );
    }

    private List<RawHotel> baliHotels() {
        return List.of(
            new RawHotel("h_bal_1", "Four Seasons Resort Bali at Sayan", "Jungle luxury resort",
                5, 9.7, "Sayan, Ubud, Bali 80571", "Indonesia", -8.4942, 115.2573,
                new BigDecimal("650"), "Villa with Private Pool",
                amenities("WIFI","INFINITY_POOL","SPA","GYM","RESTAURANT","YOGA"),
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
                "Free cancellation up to 7 days", true, true),
            new RawHotel("h_bal_2", "Seminyak Beach Resort & Spa", "Beachfront Seminyak hotel",
                4, 8.7, "Jl. Camplung Tanduk No.10, Seminyak, Bali", "Indonesia", -8.6893, 115.1571,
                new BigDecimal("120"), "Deluxe Pool View Room",
                amenities("WIFI","POOL","SPA","BEACH","RESTAURANT","BAR"),
                "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400",
                "Free cancellation up to 48 hours", true, false),
            new RawHotel("h_bal_3", "Kuta Bali Hostel", "Budget backpacker hostel",
                2, 8.0, "Jl. Legian No.5, Kuta, Bali", "Indonesia", -8.7222, 115.1710,
                new BigDecimal("12"), "Dorm Bed",
                amenities("WIFI","POOL","COMMON_AREA"),
                "https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=400",
                "Free cancellation up to 24 hours", true, false)
        );
    }

    private List<RawHotel> genericHotels(String dest) {
        String titleDest = dest.substring(0, 1).toUpperCase() + dest.substring(1);
        return List.of(
            new RawHotel("h_gen_1", titleDest + " Grand Hotel", "Premium 5-star hotel in city center",
                5, 9.0, "City Center, " + titleDest, "International", 0.0, 0.0,
                new BigDecimal("250"), "Superior Room",
                amenities("WIFI","POOL","SPA","GYM","RESTAURANT","BAR"),
                "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
                "Free cancellation up to 48 hours", true, true),
            new RawHotel("h_gen_2", titleDest + " Boutique Stay", "Cosy boutique hotel",
                4, 8.6, "Old Town, " + titleDest, "International", 0.0, 0.0,
                new BigDecimal("120"), "Deluxe Room",
                amenities("WIFI","RESTAURANT","BAR"),
                "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400",
                "Free cancellation up to 24 hours", true, false),
            new RawHotel("h_gen_3", "Budget Inn " + titleDest, "Clean affordable budget hotel",
                3, 7.8, "Near Station, " + titleDest, "International", 0.0, 0.0,
                new BigDecimal("55"), "Standard Room",
                amenities("WIFI","RESTAURANT"),
                "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400",
                "Non-refundable", false, false)
        );
    }

    private List<String> amenities(String... items) {
        return List.of(items);
    }

    // Simple value object for hotel template data
    private record RawHotel(
        String id, String name, String description,
        int stars, double guestRating, String address, String country,
        double lat, double lon, BigDecimal basePrice, String roomType,
        List<String> amenities, String imageUrl,
        String cancellation, boolean freeCancellation, boolean breakfastIncluded
    ) {}
}
