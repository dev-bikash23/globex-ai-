package com.globex.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Login request body")
public class LoginRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email address")
    @Schema(example = "bikas@example.com")
    private String email;

    @NotBlank(message = "Password is required")
    @Schema(example = "GlobeX@2026")
    private String password;

    public String getEmail()                { return email; }
    public void setEmail(String email)      { this.email = email; }
    public String getPassword()             { return password; }
    public void setPassword(String pass)    { this.password = pass; }
}
