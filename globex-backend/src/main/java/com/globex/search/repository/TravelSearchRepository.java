package com.globex.search.repository;

import com.globex.search.domain.TravelSearch;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface TravelSearchRepository extends JpaRepository<TravelSearch, String> {

    List<TravelSearch> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);

    long countByUserId(String userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM TravelSearch ts WHERE ts.userId = :userId")
    void deleteAllByUserId(@Param("userId") String userId);

    @Query("SELECT ts FROM TravelSearch ts WHERE ts.userId = :userId AND ts.searchType = :type ORDER BY ts.createdAt DESC")
    List<TravelSearch> findByUserIdAndSearchType(@Param("userId") String userId,
                                                  @Param("type") String type,
                                                  Pageable pageable);
}
