package com.globex.favorite.service;

import com.globex.destination.repository.DestinationRepository;
import com.globex.favorite.domain.UserFavoriteDestination;
import com.globex.favorite.dto.FavoriteResponse;
import com.globex.favorite.repository.FavoriteDestinationRepository;
import com.globex.auth.repository.UserRepository;
import com.globex.shared.exception.ConflictException;
import com.globex.shared.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class FavoriteService {

    private final FavoriteDestinationRepository favoriteRepository;
    private final DestinationRepository destinationRepository;
    private final UserRepository userRepository;

    public FavoriteService(
            FavoriteDestinationRepository favoriteRepository,
            DestinationRepository destinationRepository,
            UserRepository userRepository) {
        this.favoriteRepository = favoriteRepository;
        this.destinationRepository = destinationRepository;
        this.userRepository = userRepository;
    }

    /**
     * Resolves the authenticated user's email to their UUID.
     * The JWT contains the email as subject — never trust client-provided userId.
     */
    private String resolveUserId(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getId();
    }

    @Transactional
    public FavoriteResponse addFavorite(String email, String destinationId) {
        String userId = resolveUserId(email);

        var destination = destinationRepository.findById(destinationId)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found: " + destinationId));

        if (favoriteRepository.existsByUserIdAndDestinationId(userId, destinationId)) {
            throw new ConflictException("FAVORITE_ALREADY_EXISTS", "Destination already saved to favorites");
        }

        var fav = new UserFavoriteDestination();
        fav.setUserId(userId);
        fav.setDestinationId(destinationId);
        favoriteRepository.save(fav);

        return FavoriteResponse.from(fav, destination);
    }

    @Transactional
    public void removeFavorite(String email, String destinationId) {
        String userId = resolveUserId(email);

        if (!favoriteRepository.existsByUserIdAndDestinationId(userId, destinationId)) {
            throw new ResourceNotFoundException("Favorite not found");
        }
        favoriteRepository.deleteByUserIdAndDestinationId(userId, destinationId);
    }

    @Transactional(readOnly = true)
    public List<FavoriteResponse> getMyFavorites(String email) {
        String userId = resolveUserId(email);
        return favoriteRepository.findByUserId(userId).stream()
                .map(fav -> {
                    var destination = destinationRepository.findById(fav.getDestinationId())
                            .orElseThrow(() -> new ResourceNotFoundException("Destination not found: " + fav.getDestinationId()));
                    return FavoriteResponse.from(fav, destination);
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public boolean isFavorited(String email, String destinationId) {
        String userId = resolveUserId(email);
        return favoriteRepository.existsByUserIdAndDestinationId(userId, destinationId);
    }
}
