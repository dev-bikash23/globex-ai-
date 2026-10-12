package com.globex.integration.mock;

import com.globex.travel.domain.ActivityOffer;
import com.globex.travel.domain.OfferPrice;
import com.globex.travel.activity.dto.ActivitySearchRequest;
import com.globex.travel.activity.provider.ActivityProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Demo activity data provider — clearly labeled DEMO DATA in UI.
 *
 * WHY THIS EXISTS:
 * Real activity APIs (Viator, GetYourGuide) require formal partner vetting
 * and B2B agreements. No self-service free tier exists for portfolio use.
 * This mock demonstrates the provider abstraction. Real provider = swap this class only.
 *
 * All activity names, prices, and details are for demonstration only.
 */
@Component
public class MockActivityProvider implements ActivityProvider {

    private static final Logger log = LoggerFactory.getLogger(MockActivityProvider.class);

    @Override
    public String providerName() { return "mock"; }

    @Override
    public boolean isTestMode() { return true; }

    @Override
    public List<ActivityOffer> searchActivities(ActivitySearchRequest request) {
        log.info("[MockActivityProvider] Returning demo activities for: {}", request.destination());

        String dest = request.destination().toLowerCase();
        List<ActivityOffer> activities = getActivitiesForDestination(dest, request.latitude(), request.longitude());

        // Apply category filter
        if (request.category() != null && !request.category().isBlank()
                && !request.category().equalsIgnoreCase("ALL")) {
            final String cat = request.category().toUpperCase();
            activities = activities.stream()
                .filter(a -> a.category().equalsIgnoreCase(cat))
                .collect(Collectors.toList());
        }

        return activities;
    }

    private List<ActivityOffer> getActivitiesForDestination(String dest, double lat, double lon) {
        if (dest.contains("london") || dest.contains("lhr") || dest.contains("lon")) {
            return londonActivities(lat, lon);
        } else if (dest.contains("paris") || dest.contains("cdg") || dest.contains("par")) {
            return parisActivities(lat, lon);
        } else if (dest.contains("new york") || dest.contains("jfk") || dest.contains("nyc")) {
            return newYorkActivities(lat, lon);
        } else if (dest.contains("tokyo") || dest.contains("nrt")) {
            return tokyoActivities(lat, lon);
        } else if (dest.contains("dubai") || dest.contains("dxb")) {
            return dubaiActivities(lat, lon);
        } else if (dest.contains("delhi") || dest.contains("del") || dest.contains("india")) {
            return delhiActivities(lat, lon);
        } else if (dest.contains("mumbai") || dest.contains("bom")) {
            return mumbaiActivities(lat, lon);
        } else if (dest.contains("bali") || dest.contains("dps")) {
            return baliActivities(lat, lon);
        } else if (dest.contains("singapore") || dest.contains("sin")) {
            return singaporeActivities(lat, lon);
        } else {
            return genericActivities(dest, lat, lon);
        }
    }

    private List<ActivityOffer> londonActivities(double lat, double lon) {
        return List.of(
            activity("act_lon_1", "London Eye Experience", "Iconic observation wheel with panoramic views",
                "SIGHTSEEING", lat, lon, 60, "31.00", "GBP", 4.6, 28400,
                "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400",
                "Free cancellation 24h before", List.of("Gondola ride","City views"), List.of()),
            activity("act_lon_2", "Tower of London & Crown Jewels Tour", "Guided tour of the historic fortress",
                "TOURS", lat, lon, 120, "29.90", "GBP", 4.8, 15200,
                "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=400",
                "Free cancellation 24h before", List.of("Guide","Crown Jewels access"), List.of("Transport")),
            activity("act_lon_3", "Harry Potter Warner Bros Studio Tour", "Explore the real film sets",
                "TOURS", lat, lon, 240, "47.00", "GBP", 4.9, 52000,
                "https://images.unsplash.com/photo-1520962922320-2038eebab146?w=400",
                "No cancellation", List.of("Studio access","Exhibition"), List.of("Transport","Meals")),
            activity("act_lon_4", "East End Food Tour", "Street food and market tour in Shoreditch",
                "FOOD", lat, lon, 180, "65.00", "GBP", 4.7, 3400,
                "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
                "Free cancellation 48h before", List.of("Food tastings","Guide"), List.of("Drinks")),
            activity("act_lon_5", "Thames River Cruise", "Scenic cruise from Westminster to Greenwich",
                "SIGHTSEEING", lat, lon, 75, "14.50", "GBP", 4.4, 9800,
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
                "Free cancellation 24h before", List.of("Cruise","Audio guide"), List.of()),
            activity("act_lon_6", "British Museum Highlights Tour", "Expert-guided tour of world treasures",
                "MUSEUMS", lat, lon, 90, "22.00", "GBP", 4.8, 7600,
                "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=400",
                "Free cancellation 24h before", List.of("Guide","Museum access"), List.of())
        );
    }

    private List<ActivityOffer> parisActivities(double lat, double lon) {
        return List.of(
            activity("act_par_1", "Eiffel Tower Summit Access", "Priority access to the top of the Eiffel Tower",
                "SIGHTSEEING", lat, lon, 90, "36.80", "EUR", 4.7, 89000,
                "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400",
                "Free cancellation 24h before", List.of("Summit access","Audio guide"), List.of()),
            activity("act_par_2", "Louvre Museum Guided Tour", "Expert skip-the-line Louvre tour",
                "MUSEUMS", lat, lon, 120, "68.00", "EUR", 4.9, 42000,
                "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400",
                "Free cancellation 48h before", List.of("Skip-the-line","Guide","Mona Lisa"), List.of()),
            activity("act_par_3", "Seine River Dinner Cruise", "Romantic dinner cruise at sunset",
                "FOOD", lat, lon, 150, "95.00", "EUR", 4.6, 12000,
                "https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400",
                "Free cancellation 48h before", List.of("3-course dinner","Wine","Live music"), List.of()),
            activity("act_par_4", "Montmartre & Sacré-Cœur Walking Tour", "Explore the artistic heart of Paris",
                "TOURS", lat, lon, 120, "25.00", "EUR", 4.8, 18000,
                "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400",
                "Free cancellation 24h before", List.of("Guide","Basilica access"), List.of()),
            activity("act_par_5", "French Cooking Class", "Learn to make croissants and classic sauces",
                "FOOD", lat, lon, 180, "120.00", "EUR", 4.9, 5600,
                "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
                "Free cancellation 48h before", List.of("Ingredients","Recipe booklet","Meal"), List.of())
        );
    }

    private List<ActivityOffer> newYorkActivities(double lat, double lon) {
        return List.of(
            activity("act_nyc_1", "Statue of Liberty & Ellis Island Tour", "Full-day iconic NYC landmarks",
                "SIGHTSEEING", lat, lon, 300, "30.00", "USD", 4.6, 65000,
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
                "Free cancellation 24h before", List.of("Ferry","Both islands"), List.of()),
            activity("act_nyc_2", "Top of the Rock Observatory", "360° views from Rockefeller Center",
                "SIGHTSEEING", lat, lon, 60, "40.00", "USD", 4.7, 34000,
                "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400",
                "Free cancellation 24h before", List.of("Observatory access"), List.of()),
            activity("act_nyc_3", "NYC Food Tour: Brooklyn", "Culinary crawl through the best Brooklyn spots",
                "FOOD", lat, lon, 180, "75.00", "USD", 4.8, 8900,
                "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
                "Free cancellation 48h before", List.of("6+ tastings","Guide"), List.of("Drinks")),
            activity("act_nyc_4", "Metropolitan Museum of Art Guided Tour", "Highlights of the Met",
                "MUSEUMS", lat, lon, 120, "55.00", "USD", 4.8, 21000,
                "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=400",
                "Free cancellation 24h before", List.of("Guide","Museum access"), List.of()),
            activity("act_nyc_5", "Central Park Bike Tour", "Explore Central Park on wheels",
                "ADVENTURE", lat, lon, 90, "45.00", "USD", 4.5, 12000,
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
                "Free cancellation 24h before", List.of("Bike rental","Helmet","Guide"), List.of())
        );
    }

    private List<ActivityOffer> tokyoActivities(double lat, double lon) {
        return List.of(
            activity("act_tyo_1", "teamLab Borderless Digital Art Museum", "Immersive digital art experience",
                "MUSEUMS", lat, lon, 120, "3200", "JPY", 4.9, 45000,
                "https://images.unsplash.com/photo-1553653924-39b70295f8da?w=400",
                "No cancellation", List.of("Museum access"), List.of()),
            activity("act_tyo_2", "Tokyo Street Food Tour: Shibuya & Shinjuku", "After-dark food adventure",
                "FOOD", lat, lon, 180, "8500", "JPY", 4.8, 6700,
                "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400",
                "Free cancellation 48h before", List.of("6+ tastings","Guide"), List.of()),
            activity("act_tyo_3", "Mount Fuji & Hakone Day Trip", "See Japan's iconic peak up close",
                "NATURE", lat, lon, 480, "14000", "JPY", 4.7, 28000,
                "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400",
                "Free cancellation 48h before", List.of("Transport","Guide","Lunch"), List.of()),
            activity("act_tyo_4", "Traditional Tea Ceremony", "Authentic matcha ceremony in Hamarikyu",
                "CULTURAL", lat, lon, 60, "2000", "JPY", 4.7, 9400,
                "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400",
                "Free cancellation 24h before", List.of("Tea","Traditional setting"), List.of())
        );
    }

    private List<ActivityOffer> dubaiActivities(double lat, double lon) {
        return List.of(
            activity("act_dxb_1", "Desert Safari with BBQ Dinner", "Dune bashing, camel ride & BBQ",
                "ADVENTURE", lat, lon, 360, "75.00", "USD", 4.7, 52000,
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
                "Free cancellation 24h before", List.of("Dune bashing","Camel ride","BBQ dinner","Belly dance"), List.of()),
            activity("act_dxb_2", "Burj Khalifa At the Top", "Visit the world's tallest building",
                "SIGHTSEEING", lat, lon, 90, "49.00", "USD", 4.6, 87000,
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400",
                "Free cancellation 48h before", List.of("Levels 124+125 access"), List.of()),
            activity("act_dxb_3", "Dubai Food Tour: Old Dubai", "Explore the spice souk and local eats",
                "FOOD", lat, lon, 180, "65.00", "USD", 4.8, 4300,
                "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
                "Free cancellation 48h before", List.of("Food tastings","Guide"), List.of()),
            activity("act_dxb_4", "Skydiving Over the Palm", "Tandem skydive with Palm Jumeirah views",
                "ADVENTURE", lat, lon, 240, "499.00", "USD", 4.9, 3200,
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
                "Free cancellation 72h before", List.of("Tandem jump","Certificate","Video"), List.of())
        );
    }

    private List<ActivityOffer> delhiActivities(double lat, double lon) {
        return List.of(
            activity("act_del_1", "Old Delhi Food Walk", "Taste 2000 years of Mughal food heritage",
                "FOOD", lat, lon, 180, "1200", "INR", 4.8, 4800,
                "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
                "Free cancellation 48h before", List.of("8+ food tastings","Guide"), List.of("Drinks")),
            activity("act_del_2", "Red Fort & Chandni Chowk Tour", "Explore Mughal heritage and bazaars",
                "HISTORICAL", lat, lon, 240, "1500", "INR", 4.7, 9200,
                "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400",
                "Free cancellation 24h before", List.of("Red Fort entry","Guide","Rickshaw ride"), List.of()),
            activity("act_del_3", "Qutub Minar Sunrise Tour", "Private tour at golden hour",
                "SIGHTSEEING", lat, lon, 120, "2000", "INR", 4.9, 2100,
                "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400",
                "Free cancellation 48h before", List.of("Entry ticket","Guide"), List.of()),
            activity("act_del_4", "Yoga & Meditation Session", "Morning yoga at Lodi Garden",
                "WELLNESS", lat, lon, 90, "800", "INR", 4.8, 1200,
                "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400",
                "Free cancellation 24h before", List.of("Session","Mat","Water"), List.of()),
            activity("act_del_5", "Delhi By Night Tuk-Tuk Tour", "Explore Delhi's landmarks after dark",
                "TOURS", lat, lon, 180, "1800", "INR", 4.6, 3700,
                "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400",
                "Free cancellation 24h before", List.of("Tuk-tuk ride","Guide"), List.of())
        );
    }

    private List<ActivityOffer> mumbaiActivities(double lat, double lon) {
        return List.of(
            activity("act_bom_1", "Mumbai Street Food Tour: Dharavi & Beyond", "A real food journey",
                "FOOD", lat, lon, 180, "1500", "INR", 4.9, 2800,
                "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
                "Free cancellation 48h before", List.of("8+ tastings","Guide"), List.of()),
            activity("act_bom_2", "Dharavi Slum Guided Walk", "Insightful walk through Asia's largest township",
                "CULTURAL", lat, lon, 150, "1000", "INR", 4.8, 5200,
                "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400",
                "Free cancellation 24h before", List.of("Guide","Local interaction"), List.of("Photography")),
            activity("act_bom_3", "Bollywood Studio Tour", "Behind the scenes of Indian film industry",
                "CULTURAL", lat, lon, 240, "3500", "INR", 4.6, 3100,
                "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400",
                "Free cancellation 48h before", List.of("Studio access","Guide","Costume try-on"), List.of())
        );
    }

    private List<ActivityOffer> baliActivities(double lat, double lon) {
        return List.of(
            activity("act_bal_1", "Ubud Monkey Forest & Rice Terrace Tour", "Iconic Bali highlights",
                "NATURE", lat, lon, 360, "45.00", "USD", 4.7, 28000,
                "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400",
                "Free cancellation 24h before", List.of("Transport","Guide","Lunch"), List.of()),
            activity("act_bal_2", "Mount Batur Sunrise Trekking", "Hike an active volcano at dawn",
                "ADVENTURE", lat, lon, 480, "35.00", "USD", 4.8, 14000,
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
                "Free cancellation 48h before", List.of("Guide","Breakfast at summit"), List.of()),
            activity("act_bal_3", "Balinese Cooking Class", "Learn to cook 7 traditional Balinese dishes",
                "FOOD", lat, lon, 300, "55.00", "USD", 4.9, 6800,
                "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
                "Free cancellation 48h before", List.of("Market visit","Class","Meal"), List.of()),
            activity("act_bal_4", "White Water Rafting on Ayung River", "Thrilling river adventure",
                "ADVENTURE", lat, lon, 180, "40.00", "USD", 4.6, 18000,
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
                "Free cancellation 24h before", List.of("Equipment","Guide","Lunch"), List.of())
        );
    }

    private List<ActivityOffer> singaporeActivities(double lat, double lon) {
        return List.of(
            activity("act_sin_1", "Gardens by the Bay Supertree Show", "Evening light and sound show",
                "SIGHTSEEING", lat, lon, 120, "28.00", "SGD", 4.7, 32000,
                "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400",
                "Free cancellation 24h before", List.of("Garden entry","Light show"), List.of()),
            activity("act_sin_2", "Singapore Hawker Food Tour", "Eat like a local at hawker centres",
                "FOOD", lat, lon, 180, "65.00", "SGD", 4.9, 5800,
                "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
                "Free cancellation 48h before", List.of("6+ tastings","Guide"), List.of())
        );
    }

    private List<ActivityOffer> genericActivities(String dest, double lat, double lon) {
        String titleDest = dest.isEmpty() ? "the City" :
            dest.substring(0, 1).toUpperCase() + dest.substring(1);
        return List.of(
            activity("act_gen_1", titleDest + " City Highlights Tour", "Best of " + titleDest + " with expert guide",
                "TOURS", lat, lon, 180, "35.00", "USD", 4.6, 2000,
                "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400",
                "Free cancellation 24h before", List.of("Guide","Entry tickets"), List.of()),
            activity("act_gen_2", titleDest + " Food Experience", "Taste the best local food",
                "FOOD", lat, lon, 150, "45.00", "USD", 4.7, 1200,
                "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
                "Free cancellation 48h before", List.of("Tastings","Guide"), List.of()),
            activity("act_gen_3", "Cultural Heritage Walk", "Discover history and culture on foot",
                "CULTURAL", lat, lon, 120, "25.00", "USD", 4.5, 800,
                "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400",
                "Free cancellation 24h before", List.of("Guide"), List.of())
        );
    }

    private ActivityOffer activity(
        String id, String name, String desc, String category,
        double lat, double lon, int durationMins, String price, String currency,
        double rating, int reviewCount, String imageUrl,
        String cancellation, List<String> inclusions, List<String> exclusions) {

        String durationDisplay = durationMins >= 60
            ? (durationMins / 60) + "h" + (durationMins % 60 > 0 ? " " + durationMins % 60 + "m" : "")
            : durationMins + " min";

        return new ActivityOffer(
            id, "mock", name,
            desc,  // shortDescription
            desc,  // description
            category,
            (Double) lat, (Double) lon,
            durationDisplay, durationMins,
            new OfferPrice(new BigDecimal(price), currency),
            (Double) rating, reviewCount,
            "https://www.viator.com/",  // bookingLink
            List.of(imageUrl),
            cancellation, cancellation.toLowerCase().contains("free"),
            inclusions, exclusions,
            Instant.now(), true
        );
    }
}
