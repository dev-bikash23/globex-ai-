package com.globex.auth.service;

import com.globex.auth.domain.AuditLog;
import com.globex.auth.domain.AuditLog.AuditEventType;
import com.globex.auth.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Records all security events asynchronously — never blocks the request path.
 */
@Service
public class AuditLogService {

    private static final Logger log = LoggerFactory.getLogger(AuditLogService.class);
    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Async("taskExecutor")
    public void log(AuditEventType eventType, String userId,
                    String description, HttpServletRequest request) {
        try {
            AuditLog entry = new AuditLog();
            entry.setAction(eventType.name());
            entry.setUserId(userId);
            entry.setFailureReason(description);
            entry.setSuccess(!eventType.name().contains("FAILED") && !eventType.name().contains("LOCKED"));
            if (request != null) {
                entry.setIpAddress(getClientIp(request));
                entry.setUserAgent(truncate(request.getHeader("User-Agent"), 500));
            }
            auditLogRepository.save(entry);
        } catch (Exception e) {
            log.error("Failed to write audit log [{}]: {}", eventType, e.getMessage());
        }
    }

    @Async("taskExecutor")
    public void log(AuditEventType eventType, String userId, String description) {
        log(eventType, userId, description, null);
    }

    private String getClientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) return xff.split(",")[0].trim();
        return request.getRemoteAddr();
    }

    private String truncate(String value, int maxLen) {
        if (value == null) return null;
        return value.length() <= maxLen ? value : value.substring(0, maxLen);
    }
}
