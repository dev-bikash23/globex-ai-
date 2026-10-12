package com.globex.user.service;

import com.globex.auth.domain.Role;
import com.globex.auth.domain.User;
import com.globex.auth.dto.UserProfileDto;
import com.globex.auth.repository.UserRepository;
import com.globex.shared.exception.ResourceNotFoundException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * User profile service — fetching and updating the authenticated user's profile.
 * NEVER trusts user-supplied IDs — always derives identity from Spring Security context.
 */
@Service
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Get the authenticated user's profile.
     * Identity derived from the JWT — not from request parameters.
     */
    public UserProfileDto getMyProfile(UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", principal.getUsername()));
        return toDto(user);
    }

    /**
     * Update display name only (Phase 2 scope — full profile edit in later phases).
     */
    @Transactional
    public UserProfileDto updateDisplayName(UserDetails principal, String displayName) {
        User user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", principal.getUsername()));
        user.setDisplayName(displayName != null ? displayName.trim() : null);
        return toDto(userRepository.save(user));
    }

    private UserProfileDto toDto(User user) {
        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setDisplayName(user.getDisplayName());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setEmailVerified(user.isEmailVerified());
        dto.setStatus(user.getStatus() != null ? user.getStatus().name() : null);
        dto.setCreatedAt(user.getCreatedAt());
        dto.setLastLoginAt(user.getLastLoginAt());
        String role = user.getRoles().stream()
                .map(Role::getName).findFirst().orElse(Role.USER);
        dto.setRole(role);
        return dto;
    }
}
