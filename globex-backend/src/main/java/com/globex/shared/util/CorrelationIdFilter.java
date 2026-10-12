package com.globex.shared.util;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.util.UUID;

/**
 * Correlation ID filter — adds a unique request ID to every request.
 *
 * <h2>Why?</h2>
 * When debugging production issues, you need to trace a single request
 * across multiple log lines. The requestId links all log entries for one request.
 *
 * <h2>How it works:</h2>
 * 1. Check if client sent X-Request-ID header (some clients/gateways do)
 * 2. If not, generate a new UUID
 * 3. Store in SLF4J MDC (Mapped Diagnostic Context) so logback includes it in every log line
 * 4. Add X-Request-ID to response headers so frontend can reference it in bug reports
 *
 * <h2>Java Concept — Servlet Filter vs Spring Filter:</h2>
 * This implements the standard Java Servlet Filter, giving us control over every request
 * before Spring MVC processes it (useful for logging infrastructure).
 */
@Component
@Order(1)   // Run first before all other filters
public class CorrelationIdFilter implements Filter {

    private static final String REQUEST_ID_HEADER = "X-Request-ID";
    private static final String MDC_KEY = "requestId";

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest  httpRequest  = (HttpServletRequest)  request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Use client-provided ID or generate a new one
        String requestId = httpRequest.getHeader(REQUEST_ID_HEADER);
        if (!StringUtils.hasText(requestId)) {
            requestId = UUID.randomUUID().toString();
        }

        // Put in MDC — logback pattern %X{requestId} will include this in every log line
        MDC.put(MDC_KEY, requestId);

        // Echo back in response so frontend can reference it in error reports
        httpResponse.setHeader(REQUEST_ID_HEADER, requestId);

        try {
            chain.doFilter(request, response);
        } finally {
            // ALWAYS clear MDC after request completes — threads are reused (thread pool)
            // If we don't clear, the next request on this thread inherits the old requestId
            MDC.remove(MDC_KEY);
        }
    }
}
