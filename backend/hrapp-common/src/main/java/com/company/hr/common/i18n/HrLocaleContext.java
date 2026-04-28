package com.company.hr.common.i18n;

import java.util.Locale;

/**
 * Resolved locale metadata scoped to a single request.
 */
public record HrLocaleContext(
        String localeCode,
        Locale locale,
        String direction
) {

    public static HrLocaleContext from(HrSupportedLocale supportedLocale) {
        return new HrLocaleContext(
                supportedLocale.code(),
                supportedLocale.locale(),
                supportedLocale.direction()
        );
    }
}
