package com.globex.auth.service;

/**
 * Email service abstraction — enables swapping ConsoleEmailService (dev)
 * for a real SMTP/SendGrid provider in production without changing callers.
 *
 * This is the Strategy design pattern applied to email delivery.
 */
public interface EmailService {

    /**
     * Send email verification link to a newly registered user.
     * @param toEmail  recipient email
     * @param firstName recipient's first name for personalisation
     * @param token    verification token (not the full URL — URL built inside)
     */
    void sendVerificationEmail(String toEmail, String firstName, String token);

    /**
     * Send password reset link.
     * @param toEmail  recipient email
     * @param firstName recipient's first name
     * @param token    short-lived reset token
     */
    void sendPasswordResetEmail(String toEmail, String firstName, String token);

    /**
     * Send confirmation that password was changed (security notification).
     */
    void sendPasswordChangedNotification(String toEmail, String firstName);
}
