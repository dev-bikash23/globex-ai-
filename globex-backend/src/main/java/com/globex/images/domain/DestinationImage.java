package com.globex.images.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "destination_images")
public class DestinationImage {

    @Id
    private String id;

    @Column(name = "destination_id", nullable = false, length = 36)
    private String destinationId;

    @Column(name = "provider", nullable = false, length = 50)
    private String provider;

    @Column(name = "image_url", nullable = false, columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "thumbnail_url", columnDefinition = "TEXT")
    private String thumbnailUrl;

    @Column(name = "photographer", length = 150)
    private String photographer;

    @Column(name = "photographer_url", columnDefinition = "TEXT")
    private String photographerUrl;

    @Column(name = "attribution_html", columnDefinition = "TEXT")
    private String attributionHtml;

    @Column(name = "fetched_at", nullable = false)
    private Instant fetchedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    public void prePersist() {
        if (id == null) id = java.util.UUID.randomUUID().toString();
        if (fetchedAt == null) fetchedAt = Instant.now();
        if (createdAt == null) createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getDestinationId() { return destinationId; }
    public void setDestinationId(String destinationId) { this.destinationId = destinationId; }
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }
    public String getPhotographer() { return photographer; }
    public void setPhotographer(String photographer) { this.photographer = photographer; }
    public String getPhotographerUrl() { return photographerUrl; }
    public void setPhotographerUrl(String photographerUrl) { this.photographerUrl = photographerUrl; }
    public String getAttributionHtml() { return attributionHtml; }
    public void setAttributionHtml(String attributionHtml) { this.attributionHtml = attributionHtml; }
    public Instant getFetchedAt() { return fetchedAt; }
    public void setFetchedAt(Instant fetchedAt) { this.fetchedAt = fetchedAt; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
