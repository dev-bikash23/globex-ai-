package com.globex.images.repository;

import com.globex.images.domain.DestinationImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DestinationImageRepository extends JpaRepository<DestinationImage, String> {
    List<DestinationImage> findByDestinationId(String destinationId);
    void deleteByDestinationId(String destinationId);
}
