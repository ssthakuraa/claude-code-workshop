package com.company.hr.common.message;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Provides i18n messages from messages.properties / messages_fr.properties.
 * Uses the current request locale (set by Spring's LocaleContextHolder).
 */
@Component
public class HrMessageProvider {

    private final MessageSource messageSource;

    public HrMessageProvider(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    /**
     * Get message using the current request locale.
     */
    public String getMessage(String key, Object... args) {
        return messageSource.getMessage(key, args, LocaleContextHolder.getLocale());
    }

    /**
     * Get message for a specific locale.
     */
    public String getMessage(String key, Locale locale, Object... args) {
        return messageSource.getMessage(key, args, locale);
    }

    /**
     * Get message with a fallback if key not found.
     */
    public String getMessageOrDefault(String key, String defaultMessage, Object... args) {
        return messageSource.getMessage(key, args, defaultMessage, LocaleContextHolder.getLocale());
    }
}
