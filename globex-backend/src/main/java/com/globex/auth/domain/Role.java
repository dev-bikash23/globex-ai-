package com.globex.auth.domain;

import jakarta.persistence.*;

/**
 * Role entity — defines RBAC roles in GlobeX.
 * Current roles: USER, ADMIN. Future: TRAVEL_PARTNER, CONTENT_MANAGER.
 */
@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true, length = 50)
    private String name;

    @Column(name = "description", length = 255)
    private String description;

    public Role() {}
    public Role(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public Long getId()                     { return id; }
    public void setId(Long id)              { this.id = id; }
    public String getName()                 { return name; }
    public void setName(String name)        { this.name = name; }
    public String getDescription()          { return description; }
    public void setDescription(String v)    { this.description = v; }

    public static final String USER           = "USER";
    public static final String ADMIN          = "ADMIN";
    public static final String TRAVEL_PARTNER = "TRAVEL_PARTNER";
}
