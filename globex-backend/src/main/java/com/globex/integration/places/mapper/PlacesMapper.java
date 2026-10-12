package com.globex.integration.places.mapper;

import com.globex.integration.places.dto.PlaceResponse;
import com.globex.integration.places.dto.external.OverpassResponse;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Component
public class PlacesMapper {

    private double calculateDistanceMeters(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371000; // Radius of the earth in meters
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public List<PlaceResponse> toPlaceResponses(double centerLat, double centerLon, OverpassResponse raw, int limit) {
        if (raw == null || raw.elements() == null) {
            return List.of();
        }

        List<PlaceResponse> places = new ArrayList<>();

        for (OverpassResponse.Element el : raw.elements()) {
            if (el.tags() == null) continue;
            Map<String, String> tags = el.tags();

            String name = tags.get("name");
            if (name == null || name.isBlank()) {
                name = tags.get("name:en");
            }
            if (name == null || name.isBlank()) continue;

            Double lat = el.lat();
            Double lon = el.lon();
            if ((lat == null || lon == null) && el.center() != null) {
                lat = el.center().lat();
                lon = el.center().lon();
            }
            if (lat == null || lon == null) continue;

            String category = determineCategory(tags);
            String placeType = determineType(tags);
            String address = formatAddress(tags);
            String description = tags.get("description");
            String website = tags.get("website");
            if (website == null) website = tags.get("contact:website");
            String openingHours = tags.get("opening_hours");

            double distance = calculateDistanceMeters(centerLat, centerLon, lat, lon);

            places.add(new PlaceResponse(
                    "osm-" + el.id(),
                    name,
                    category,
                    placeType,
                    lat,
                    lon,
                    Math.round(distance * 10.0) / 10.0,
                    address,
                    description,
                    website,
                    openingHours,
                    "OpenStreetMap",
                    "© OpenStreetMap contributors (ODbL)"
            ));
        }

        // Sort by closest distance first
        places.sort(Comparator.comparingDouble(p -> p.distanceMeters() != null ? p.distanceMeters() : 0.0));

        if (places.size() > limit) {
            return places.subList(0, limit);
        }
        return places;
    }

    private String determineCategory(Map<String, String> tags) {
        if (tags.containsKey("tourism")) {
            return switch (tags.get("tourism")) {
                case "museum" -> "Museum";
                case "viewpoint" -> "Viewpoint";
                case "gallery" -> "Art Gallery";
                case "theme_park" -> "Amusement Park";
                case "zoo" -> "Zoo";
                case "aquarium" -> "Aquarium";
                default -> "Attraction";
            };
        }
        if (tags.containsKey("historic")) return "Historic Site";
        if (tags.containsKey("leisure")) {
            return switch (tags.get("leisure")) {
                case "park" -> "Park";
                case "garden" -> "Garden";
                default -> "Leisure";
            };
        }
        if (tags.containsKey("amenity")) {
            return switch (tags.get("amenity")) {
                case "place_of_worship" -> "Religious Site";
                case "theatre" -> "Theatre";
                case "restaurant" -> "Restaurant";
                case "cafe" -> "Cafe";
                default -> "Point of Interest";
            };
        }
        return "Attraction";
    }

    private String determineType(Map<String, String> tags) {
        if (tags.containsKey("tourism")) return tags.get("tourism");
        if (tags.containsKey("historic")) return tags.get("historic");
        if (tags.containsKey("leisure")) return tags.get("leisure");
        if (tags.containsKey("amenity")) return tags.get("amenity");
        return "landmark";
    }

    private String formatAddress(Map<String, String> tags) {
        StringBuilder sb = new StringBuilder();
        if (tags.containsKey("addr:housenumber")) {
            sb.append(tags.get("addr:housenumber")).append(" ");
        }
        if (tags.containsKey("addr:street")) {
            sb.append(tags.get("addr:street")).append(", ");
        }
        if (tags.containsKey("addr:city")) {
            sb.append(tags.get("addr:city"));
        }
        String res = sb.toString().trim();
        if (res.endsWith(",")) res = res.substring(0, res.length() - 1);
        return res.isEmpty() ? null : res;
    }
}
