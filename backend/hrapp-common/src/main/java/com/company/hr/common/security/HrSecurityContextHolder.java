package com.company.hr.common.security;

import com.company.hr.common.log.HrLogHelper;

import java.util.Objects;

/**
 * Thread-local holder for {@link HrSecurityContext}. Jersey filters should populate this early
 * in the request lifecycle and clear it when the request finishes to avoid leaking data across threads.
 */
public final class HrSecurityContextHolder {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrSecurityContextHolder.class);
    private static final ThreadLocal<HrSecurityContext> CONTEXT =
            ThreadLocal.withInitial(HrSecurityContext::empty);

    private HrSecurityContextHolder() {
        // utility
    }

    public static HrSecurityContext getContext() {
        return CONTEXT.get();
    }

    public static void setContext(HrSecurityContext context) {
        CONTEXT.set(Objects.requireNonNullElse(context, HrSecurityContext.empty()));
    }

    public static void clear() {
        LOGGER.debug("Clearing request security context");
        CONTEXT.remove();
    }
}
