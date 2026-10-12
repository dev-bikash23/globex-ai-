package com.globex.favorite.dto;

import com.globex.destination.domain.Destination;
import com.globex.favorite.domain.UserFavoriteDestination;

public record FavoriteResponse(
        String id,
        String destinationId,
        String destinationName,
        String destinationSlug,
        Double latitude,
        Double longitude,
        String countryName,
        String flagEmoji,
        String imageUrl,
        String savedAt
) {
    public static FavoriteResponse from(UserFavoriteDestination fav, Destination dest) {
        var country = dest.getCity().getCountry();
        return new FavoriteResponse(
                fav.getId(),
                dest.getId(),
                dest.getName(),
                dest.getSlug(),
                dest.getLatitude(),
                dest.getLongitude(),
                country.getName(),
                country.getFlagEmoji(),
                dest.getImageUrl(),
                fav.getCreatedAt().toString()
        );
    }
}
