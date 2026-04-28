package com.company.hr.common.i18n;

/**
 * Thread-local holder for the currently resolved request locale.
 */
public final class HrLocaleContextHolder {

    private static final ThreadLocal<HrLocaleContext> HOLDER = new ThreadLocal<>();

    private HrLocaleContextHolder() {
    }

    public static void set(HrLocaleContext context) {
        if (context == null) {
            clear();
            return;
        }
        HOLDER.set(context);
    }

    public static HrLocaleContext get() {
        HrLocaleContext context = HOLDER.get();
        if (context != null) {
            return context;
        }
        return HrLocaleContext.from(HrSupportedLocale.defaultLocale());
    }

    public static String getLocaleCode() {
        return get().localeCode();
    }

    public static void clear() {
        HOLDER.remove();
    }
}
