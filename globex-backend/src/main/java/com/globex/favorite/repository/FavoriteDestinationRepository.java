package com.globex.favorite.repository;

import com.globex.favorite.domain.UserFavoriteDestination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteDestinationRepository extends JpaRepository<UserFavoriteDestination, String> {

    List<UserFavoriteDestination> findByUserId(String userId);

    Optional<UserFavoriteDestination> findByUserIdAndDestinationId(String userId, String destinationId);

    boolean existsByUserIdAndDestinationId(String userId, String destinationId);

    void deleteByUserIdAndDestinationId(String userId, String destinationId);
}
