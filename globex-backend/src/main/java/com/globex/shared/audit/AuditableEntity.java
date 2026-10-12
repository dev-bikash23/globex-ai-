package com.globex.shared.audit;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * Base entity providing audit fields (createdAt, updatedAt, createdBy, updatedBy).
 * All GlobeX entities extend this class.
 *
 * @MappedSuperclass — not a table itself, provides fields to child entities.
 * @EntityListeners — Spring Data JPA auto-populates timestamps.
 */
@MappedSuperclass
@EntityListeners(org.springframework.data.jpa.domain.support.AuditingEntityListener.class)
public abstract class AuditableEntity {

    @org.springframework.data.annotation.CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @org.springframework.data.annotation.LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @org.springframework.data.annotation.CreatedBy
    @Column(name = "created_by", updatable = false, length = 36)
    private String createdBy;

    @org.springframework.data.annotation.LastModifiedBy
    @Column(name = "updated_by", length = 36)
    private String updatedBy;

    public Instant getCreatedAt()           { return createdAt; }
    public void setCreatedAt(Instant v)     { this.createdAt = v; }
    public Instant getUpdatedAt()           { return updatedAt; }
    public void setUpdatedAt(Instant v)     { this.updatedAt = v; }
    public String getCreatedBy()            { return createdBy; }
    public void setCreatedBy(String v)      { this.createdBy = v; }
    public String getUpdatedBy()            { return updatedBy; }
    public void setUpdatedBy(String v)      { this.updatedBy = v; }
}
