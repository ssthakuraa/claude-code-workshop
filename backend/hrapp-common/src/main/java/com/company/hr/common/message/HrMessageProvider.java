package com.company.hr.common.message;

import com.company.hr.common.log.HrLogHelper;

import java.text.MessageFormat;
import java.util.Locale;
import java.util.MissingResourceException;
import java.util.ResourceBundle;

/**
 * Provides i18n messages from classpath resource bundles when available.
 */
public class HrMessageProvider {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrMessageProvider.class);
    private static final String BUNDLE_NAME = "messages";

    /**
     * Get message using the current request locale.
     */
    public String getMessage(String key, Object... args) {
        return getMessage(key, Locale.getDefault(), args);
    }

    /**
     * Get message for a specific locale.
     */
    public String getMessage(String key, Locale locale, Object... args) {
        try {
            ResourceBundle bundle = ResourceBundle.getBundle(BUNDLE_NAME, locale);
            String pattern = bundle.getString(key);
            return MessageFormat.format(pattern, args);
        } catch (MissingResourceException ex) {
            LOGGER.warn("Missing i18n message key={}", key);
            return key;
        }
    }

    /**
     * Get message with a fallback if key not found.
     */
    public String getMessageOrDefault(String key, String defaultMessage, Object... args) {
        String message = getMessage(key, args);
        return key.equals(message) ? defaultMessage : message;
    }
}
