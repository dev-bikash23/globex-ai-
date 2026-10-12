package com.globex.auth.service;

import com.globex.shared.config.GlobexProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Console Email Service — Development-only email implementation.
 * Prints email content to the console instead of sending real emails.
 *
 * Active on: dev profile (default).
 * Replaced by: ProductionEmailService on the "prod" profile.
 *
 * NEVER used in production — @Profile("!prod") ensures this.
 *
 * Interview tip: This demonstrates the Open/Closed principle —
 * the system is open for extension (new email providers) but closed
 * for modification (callers don't change when the provider changes).
 */
@Service
@Primary
@Profile("!prod")
public class ConsoleEmailService implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(ConsoleEmailService.class);
    private final GlobexProperties props;

    public ConsoleEmailService(GlobexProperties props) {
        this.props = props;
    }

    @Override
    @Async("taskExecutor")
    public void sendVerificationEmail(String toEmail, String firstName, String token) {
        String verifyUrl = props.getApp().getFrontendUrl() +
                "/verify-email?token=" + token;
        log.info("""
                ╔══════════════════════════════════════════════════════════╗
                ║           [DEV] EMAIL VERIFICATION                      ║
                ╠══════════════════════════════════════════════════════════╣
                ║  To:      {}
                ║  Hi {}! Please verify your GlobeX AI account.
                ║  Verify URL: {}
                ╚══════════════════════════════════════════════════════════╝
                """, toEmail, firstName, verifyUrl);
    }

    @Override
    @Async("taskExecutor")
    public void sendPasswordResetEmail(String toEmail, String firstName, String token) {
        String resetUrl = props.getApp().getFrontendUrl() +
                "/reset-password?token=" + token;
        log.info("""
                ╔══════════════════════════════════════════════════════════╗
                ║           [DEV] PASSWORD RESET EMAIL                    ║
                ╠══════════════════════════════════════════════════════════╣
                ║  To:      {}
                ║  Hi {}! Click the link to reset your password.
                ║  Reset URL: {}
                ║  (Expires in 2 hours — single use)
                ╚══════════════════════════════════════════════════════════╝
                """, toEmail, firstName, resetUrl);
    }

    @Override
    @Async("taskExecutor")
    public void sendPasswordChangedNotification(String toEmail, String firstName) {
        log.info("""
                ╔══════════════════════════════════════════════════════════╗
                ║      [DEV] PASSWORD CHANGED NOTIFICATION                ║
                ╠══════════════════════════════════════════════════════════╣
                ║  To:  {}
                ║  Hi {}! Your GlobeX AI password was changed.
                ║  If this wasn't you, contact support immediately.
                ╚══════════════════════════════════════════════════════════╝
                """, toEmail, firstName);
    }
}
