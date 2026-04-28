package com.company.hr.common.i18n;

import java.text.MessageFormat;
import java.util.MissingResourceException;
import java.util.ResourceBundle;

/**
 * ResourceBundle-backed helper for backend-owned system text.
 */
public final class HrMessageSource {

    private static final String BUNDLE_NAME = "messages";

    private HrMessageSource() {
    }

    public static String get(String key, Object... args) {
        return getForLocale(HrLocaleContextHolder.get(), key, args);
    }

    public static String getForLocale(HrLocaleContext context, String key, Object... args) {
        try {
            ResourceBundle bundle = ResourceBundle.getBundle(BUNDLE_NAME, context.locale());
            String pattern = bundle.containsKey(key) ? bundle.getString(key) : key;
            return MessageFormat.format(pattern, args);
        } catch (MissingResourceException ex) {
            return key;
        }
    }
}
