package com.globex.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Registration request DTO — validated before reaching the service layer.
 * Uses Java standard POJO (no Lombok — explicit getters/setters for Java 24 compatibility).
 */
@Schema(description = "Registration request body")
public class RegisterRequest {

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be 2–50 characters")
    @Schema(example = "Bikas")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be 2–50 characters")
    @Schema(example = "Kumar")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email address")
    @Size(max = 255)
    @Schema(example = "bikas@example.com")
    private String email;

    /**
     * Password rules: ≥8 chars, uppercase, lowercase, digit, special char.
     * Reasonable security without excessive complexity harming usability.
     */
    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 100, message = "Password must be 8–100 characters")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&_\\-#])[A-Za-z\\d@$!%*?&_\\-#]{8,}$",
        message = "Password must contain uppercase, lowercase, digit and special character (@$!%*?&_-#)"
    )
    @Schema(example = "GlobeX@2026")
    private String password;

    public String getFirstName()                { return firstName; }
    public void setFirstName(String firstName)  { this.firstName = firstName; }
    public String getLastName()                 { return lastName; }
    public void setLastName(String lastName)    { this.lastName = lastName; }
    public String getEmail()                    { return email; }
    public void setEmail(String email)          { this.email = email; }
    public String getPassword()                 { return password; }
    public void setPassword(String password)    { this.password = password; }
}
