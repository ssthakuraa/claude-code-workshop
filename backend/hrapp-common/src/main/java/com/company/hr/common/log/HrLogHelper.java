package com.company.hr.common.log;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Structured logging helper for all HR service classes.
 *
 * Usage:
 *   private static final HrLogHelper LOGGER = new HrLogHelper(MyService.class);
 *   LOGGER.info("Entering findById(id={})", id);
 *   LOGGER.info("Exiting findById, found: {}", result.getName());
 *
 * IMPORTANT: Never log PII (email, phone, salary). Use "MASKED" as placeholder.
 */
public class HrLogHelper {

    private final Logger delegate;

    public HrLogHelper(Class<?> clazz) {
        this.delegate = LoggerFactory.getLogger(clazz);
    }

    // INFO
    public void info(String message, Object... args) {
        delegate.info(message, args);
    }

    // DEBUG
    public void debug(String message, Object... args) {
        delegate.debug(message, args);
    }

    // WARN
    public void warn(String message, Object... args) {
        delegate.warn(message, args);
    }

    // ERROR — with exception
    public void error(String message, Throwable throwable) {
        delegate.error(message, throwable);
    }

    public void error(String message, Object... args) {
        delegate.error(message, args);
    }

    // Convenience: structured entry/exit (DEBUG level to reduce noise in prod)
    public void entering(String method, Object... params) {
        if (delegate.isDebugEnabled()) {
            StringBuilder sb = new StringBuilder(">>> Entering ").append(method).append("(");
            for (int i = 0; i < params.length; i++) {
                sb.append(i % 2 == 0 ? params[i] : "=" + params[i]);
                if (i < params.length - 1 && i % 2 == 1) sb.append(", ");
            }
            sb.append(")");
            delegate.debug(sb.toString());
        }
    }

    public void exiting(String method, Object result) {
        if (delegate.isDebugEnabled()) {
            delegate.debug("<<< Exiting {}() → {}", method, result);
        }
    }

    public boolean isDebugEnabled() {
        return delegate.isDebugEnabled();
    }
}
