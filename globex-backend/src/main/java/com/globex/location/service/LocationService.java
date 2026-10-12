package com.globex.location.service;

import com.globex.travel.domain.LocationSuggestion;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

/**
 * Provides airport/city IATA code autocomplete for the flight search form.
 *
 * Uses a curated in-memory list of major world airports.
 * No external API call needed for autocomplete.
 *
 * This is intentionally a static list for reliability and speed.
 * Adding Duffel Airport & City Search API as a fallback is possible
 * without changing the interface.
 */
@Service
public class LocationService {

    private static final List<LocationSuggestion> AIRPORT_CATALOGUE = buildCatalogue();

    public List<LocationSuggestion> search(String query, int limit) {
        if (query == null || query.trim().length() < 2) return List.of();
        String q = query.trim().toLowerCase(Locale.ROOT);

        return AIRPORT_CATALOGUE.stream()
            .filter(s ->
                s.iataCode().toLowerCase().contains(q) ||
                s.name().toLowerCase().contains(q) ||
                s.cityName().toLowerCase().contains(q) ||
                s.countryName().toLowerCase().contains(q)
            )
            .limit(limit > 0 ? limit : 10)
            .collect(Collectors.toList());
    }

    private static List<LocationSuggestion> buildCatalogue() {
        return List.of(
            // India
            s("DEL", "Indira Gandhi International Airport", "New Delhi", "IN", "India"),
            s("BOM", "Chhatrapati Shivaji Maharaj International Airport", "Mumbai", "IN", "India"),
            s("BLR", "Kempegowda International Airport", "Bengaluru", "IN", "India"),
            s("CCU", "Netaji Subhas Chandra Bose International Airport", "Kolkata", "IN", "India"),
            s("MAA", "Chennai International Airport", "Chennai", "IN", "India"),
            s("HYD", "Rajiv Gandhi International Airport", "Hyderabad", "IN", "India"),
            s("COK", "Cochin International Airport", "Kochi", "IN", "India"),
            s("AMD", "Sardar Vallabhbhai Patel International Airport", "Ahmedabad", "IN", "India"),
            s("PNQ", "Pune Airport", "Pune", "IN", "India"),
            s("GOI", "Goa International Airport", "Goa", "IN", "India"),
            s("JAI", "Jaipur International Airport", "Jaipur", "IN", "India"),
            s("LKO", "Chaudhary Charan Singh Airport", "Lucknow", "IN", "India"),
            s("BBI", "Biju Patnaik International Airport", "Bhubaneswar", "IN", "India"),
            s("VTZ", "Visakhapatnam Airport", "Visakhapatnam", "IN", "India"),
            s("NAG", "Dr. Babasaheb Ambedkar International Airport", "Nagpur", "IN", "India"),
            s("PAT", "Jay Prakash Narayan Airport", "Patna", "IN", "India"),
            s("IXB", "Bagdogra Airport", "Bagdogra", "IN", "India"),
            s("ATQ", "Sri Guru Ram Dass Jee Airport", "Amritsar", "IN", "India"),
            s("SXR", "Sheikh ul-Alam Airport", "Srinagar", "IN", "India"),
            s("IXC", "Chandigarh Airport", "Chandigarh", "IN", "India"),
            s("IDR", "Devi Ahilya Bai Holkar Airport", "Indore", "IN", "India"),
            s("RPR", "Swami Vivekananda Airport", "Raipur", "IN", "India"),
            s("IXM", "Madurai Airport", "Madurai", "IN", "India"),
            s("TRZ", "Tiruchirappalli International Airport", "Tiruchirappalli", "IN", "India"),
            s("TRV", "Trivandrum International Airport", "Thiruvananthapuram", "IN", "India"),
            s("VNS", "Lal Bahadur Shastri Airport", "Varanasi", "IN", "India"),
            s("GAU", "Lokpriya Gopinath Bordoloi International Airport", "Guwahati", "IN", "India"),
            s("DIU", "Diu Airport", "Diu", "IN", "India"),
            s("UDR", "Maharana Pratap Airport", "Udaipur", "IN", "India"),
            s("JDH", "Jodhpur Airport", "Jodhpur", "IN", "India"),

            // UK
            s("LHR", "Heathrow Airport", "London", "GB", "United Kingdom"),
            s("LGW", "Gatwick Airport", "London", "GB", "United Kingdom"),
            s("STN", "Stansted Airport", "London", "GB", "United Kingdom"),
            s("LCY", "London City Airport", "London", "GB", "United Kingdom"),
            s("MAN", "Manchester Airport", "Manchester", "GB", "United Kingdom"),
            s("BHX", "Birmingham Airport", "Birmingham", "GB", "United Kingdom"),
            s("EDI", "Edinburgh Airport", "Edinburgh", "GB", "United Kingdom"),
            s("GLA", "Glasgow Airport", "Glasgow", "GB", "United Kingdom"),
            s("BRS", "Bristol Airport", "Bristol", "GB", "United Kingdom"),
            s("NCL", "Newcastle Airport", "Newcastle", "GB", "United Kingdom"),

            // USA
            s("JFK", "John F. Kennedy International Airport", "New York", "US", "United States"),
            s("LAX", "Los Angeles International Airport", "Los Angeles", "US", "United States"),
            s("ORD", "O'Hare International Airport", "Chicago", "US", "United States"),
            s("SFO", "San Francisco International Airport", "San Francisco", "US", "United States"),
            s("MIA", "Miami International Airport", "Miami", "US", "United States"),
            s("LAS", "Harry Reid International Airport", "Las Vegas", "US", "United States"),
            s("SEA", "Seattle–Tacoma International Airport", "Seattle", "US", "United States"),
            s("BOS", "Boston Logan International Airport", "Boston", "US", "United States"),
            s("DFW", "Dallas/Fort Worth International Airport", "Dallas", "US", "United States"),
            s("ATL", "Hartsfield-Jackson Atlanta International Airport", "Atlanta", "US", "United States"),
            s("EWR", "Newark Liberty International Airport", "Newark", "US", "United States"),
            s("DCA", "Ronald Reagan Washington National Airport", "Washington D.C.", "US", "United States"),

            // Europe
            s("CDG", "Charles de Gaulle Airport", "Paris", "FR", "France"),
            s("ORY", "Paris Orly Airport", "Paris", "FR", "France"),
            s("AMS", "Amsterdam Airport Schiphol", "Amsterdam", "NL", "Netherlands"),
            s("FRA", "Frankfurt Airport", "Frankfurt", "DE", "Germany"),
            s("MUC", "Munich Airport", "Munich", "DE", "Germany"),
            s("MAD", "Adolfo Suárez Madrid–Barajas Airport", "Madrid", "ES", "Spain"),
            s("BCN", "Barcelona El Prat Airport", "Barcelona", "ES", "Spain"),
            s("FCO", "Leonardo da Vinci International Airport", "Rome", "IT", "Italy"),
            s("MXP", "Milan Malpensa Airport", "Milan", "IT", "Italy"),
            s("ZRH", "Zurich Airport", "Zurich", "CH", "Switzerland"),
            s("VIE", "Vienna International Airport", "Vienna", "AT", "Austria"),
            s("CPH", "Copenhagen Airport", "Copenhagen", "DK", "Denmark"),
            s("ARN", "Stockholm Arlanda Airport", "Stockholm", "SE", "Sweden"),
            s("HEL", "Helsinki-Vantaa Airport", "Helsinki", "FI", "Finland"),
            s("OSL", "Oslo Gardermoen Airport", "Oslo", "NO", "Norway"),
            s("LIS", "Lisbon Portela Airport", "Lisbon", "PT", "Portugal"),
            s("ATH", "Athens Eleftherios Venizelos Airport", "Athens", "GR", "Greece"),
            s("WAW", "Warsaw Chopin Airport", "Warsaw", "PL", "Poland"),
            s("IST", "Istanbul Airport", "Istanbul", "TR", "Turkey"),
            s("PRG", "Václav Havel Airport Prague", "Prague", "CZ", "Czech Republic"),
            s("BRU", "Brussels Airport", "Brussels", "BE", "Belgium"),

            // Middle East
            s("DXB", "Dubai International Airport", "Dubai", "AE", "UAE"),
            s("AUH", "Abu Dhabi International Airport", "Abu Dhabi", "AE", "UAE"),
            s("DOH", "Hamad International Airport", "Doha", "QA", "Qatar"),
            s("RUH", "King Khalid International Airport", "Riyadh", "SA", "Saudi Arabia"),
            s("JED", "King Abdulaziz International Airport", "Jeddah", "SA", "Saudi Arabia"),
            s("KWI", "Kuwait International Airport", "Kuwait City", "KW", "Kuwait"),
            s("BAH", "Bahrain International Airport", "Manama", "BH", "Bahrain"),
            s("MCT", "Muscat International Airport", "Muscat", "OM", "Oman"),
            s("TLV", "Ben Gurion International Airport", "Tel Aviv", "IL", "Israel"),

            // Asia
            s("NRT", "Narita International Airport", "Tokyo", "JP", "Japan"),
            s("HND", "Tokyo Haneda Airport", "Tokyo", "JP", "Japan"),
            s("KIX", "Kansai International Airport", "Osaka", "JP", "Japan"),
            s("ICN", "Incheon International Airport", "Seoul", "KR", "South Korea"),
            s("PEK", "Beijing Capital International Airport", "Beijing", "CN", "China"),
            s("PVG", "Shanghai Pudong International Airport", "Shanghai", "CN", "China"),
            s("HKG", "Hong Kong International Airport", "Hong Kong", "HK", "Hong Kong"),
            s("SIN", "Singapore Changi Airport", "Singapore", "SG", "Singapore"),
            s("BKK", "Suvarnabhumi Airport", "Bangkok", "TH", "Thailand"),
            s("KUL", "Kuala Lumpur International Airport", "Kuala Lumpur", "MY", "Malaysia"),
            s("CGK", "Soekarno-Hatta International Airport", "Jakarta", "ID", "Indonesia"),
            s("DPS", "Ngurah Rai International Airport", "Bali", "ID", "Indonesia"),
            s("MNL", "Ninoy Aquino International Airport", "Manila", "PH", "Philippines"),
            s("SGN", "Tan Son Nhat International Airport", "Ho Chi Minh City", "VN", "Vietnam"),
            s("HAN", "Noi Bai International Airport", "Hanoi", "VN", "Vietnam"),
            s("DAC", "Hazrat Shahjalal International Airport", "Dhaka", "BD", "Bangladesh"),
            s("CMB", "Bandaranaike International Airport", "Colombo", "LK", "Sri Lanka"),
            s("KHI", "Jinnah International Airport", "Karachi", "PK", "Pakistan"),
            s("LHE", "Allama Iqbal International Airport", "Lahore", "PK", "Pakistan"),
            s("KTM", "Tribhuvan International Airport", "Kathmandu", "NP", "Nepal"),

            // Africa
            s("JNB", "O.R. Tambo International Airport", "Johannesburg", "ZA", "South Africa"),
            s("CPT", "Cape Town International Airport", "Cape Town", "ZA", "South Africa"),
            s("NBO", "Jomo Kenyatta International Airport", "Nairobi", "KE", "Kenya"),
            s("CAI", "Cairo International Airport", "Cairo", "EG", "Egypt"),
            s("CMN", "Mohammed V International Airport", "Casablanca", "MA", "Morocco"),
            s("LOS", "Murtala Muhammed International Airport", "Lagos", "NG", "Nigeria"),
            s("ADD", "Addis Ababa Bole International Airport", "Addis Ababa", "ET", "Ethiopia"),

            // Oceania
            s("SYD", "Sydney Kingsford Smith Airport", "Sydney", "AU", "Australia"),
            s("MEL", "Melbourne Airport", "Melbourne", "AU", "Australia"),
            s("BNE", "Brisbane Airport", "Brisbane", "AU", "Australia"),
            s("PER", "Perth Airport", "Perth", "AU", "Australia"),
            s("AKL", "Auckland Airport", "Auckland", "NZ", "New Zealand"),

            // Americas
            s("GRU", "São Paulo–Guarulhos International Airport", "São Paulo", "BR", "Brazil"),
            s("GIG", "Rio de Janeiro/Galeão Airport", "Rio de Janeiro", "BR", "Brazil"),
            s("BOG", "El Dorado International Airport", "Bogotá", "CO", "Colombia"),
            s("LIM", "Jorge Chávez International Airport", "Lima", "PE", "Peru"),
            s("EZE", "Ministro Pistarini International Airport", "Buenos Aires", "AR", "Argentina"),
            s("SCL", "Arturo Merino Benítez International Airport", "Santiago", "CL", "Chile"),
            s("MEX", "Mexico City International Airport", "Mexico City", "MX", "Mexico"),
            s("YYZ", "Toronto Pearson International Airport", "Toronto", "CA", "Canada"),
            s("YVR", "Vancouver International Airport", "Vancouver", "CA", "Canada"),
            s("YUL", "Montréal–Pierre Elliott Trudeau Airport", "Montreal", "CA", "Canada")
        );
    }

    private static LocationSuggestion s(String iata, String name, String city, String cc, String country) {
        return new LocationSuggestion(iata, name, city, cc, country, "AIRPORT");
    }
}
