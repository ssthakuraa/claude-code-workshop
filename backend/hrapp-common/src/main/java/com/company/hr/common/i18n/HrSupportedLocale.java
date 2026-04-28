package com.company.hr.common.i18n;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;

/**
 * Canonical supported locales for the HR runtime.
 */
public enum HrSupportedLocale {

    EN_US("en-US", "en", "US", "ltr"),
    ES_MX("es-MX", "es", "MX", "ltr"),
    HI_IN("hi-IN", "hi", "IN", "ltr"),
    FR_FR("fr-FR", "fr", "FR", "ltr");

    private static final HrSupportedLocale DEFAULT = EN_US;

    private final String code;
    private final Locale locale;
    private final String direction;

    HrSupportedLocale(String code, String language, String country, String direction) {
        this.code = code;
        this.locale = Locale.of(language, country);
        this.direction = direction;
    }

    public String code() {
        return code;
    }

    public Locale locale() {
        return locale;
    }

    public String direction() {
        return direction;
    }

    public static HrSupportedLocale defaultLocale() {
        return DEFAULT;
    }

    public static List<String> codes() {
        return List.of(EN_US.code, ES_MX.code, HI_IN.code, FR_FR.code);
    }

    public static HrSupportedLocale normalize(String rawLocale) {
        return fromTag(rawLocale).orElse(DEFAULT);
    }

    public static Optional<HrSupportedLocale> fromTag(String rawLocale) {
        if (rawLocale == null || rawLocale.isBlank()) {
            return Optional.empty();
        }

        String normalized = rawLocale.trim().replace('_', '-');
        for (HrSupportedLocale candidate : values()) {
            if (candidate.code.equalsIgnoreCase(normalized)) {
                return Optional.of(candidate);
            }
        }

        Locale locale = Locale.forLanguageTag(normalized);
        if (locale == null || locale.getLanguage().isBlank()) {
            return Optional.empty();
        }
        return fromLanguage(locale.getLanguage());
    }

    public static HrSupportedLocale resolveAcceptLanguage(String headerValue) {
        if (headerValue == null || headerValue.isBlank()) {
            return DEFAULT;
        }

        try {
            return Locale.LanguageRange.parse(headerValue).stream()
                    .map(Locale.LanguageRange::getRange)
                    .map(range -> "*".equals(range) ? null : range)
                    .filter(Objects::nonNull)
                    .map(HrSupportedLocale::fromTag)
                    .flatMap(Optional::stream)
                    .findFirst()
                    .orElse(DEFAULT);
        } catch (IllegalArgumentException ex) {
            return DEFAULT;
        }
    }

    public static List<HrSupportedLocale> valuesByPreference() {
        return List.of(values()).stream()
                .sorted(Comparator.comparing(HrSupportedLocale::code))
                .toList();
    }

    private static Optional<HrSupportedLocale> fromLanguage(String language) {
        return switch (language.toLowerCase(Locale.ROOT)) {
            case "en" -> Optional.of(EN_US);
            case "es" -> Optional.of(ES_MX);
            case "hi" -> Optional.of(HI_IN);
            case "fr" -> Optional.of(FR_FR);
            default -> Optional.empty();
        };
    }
}
