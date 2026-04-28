package com.company.hr.config;

import com.company.hr.common.log.HrLogHelper;

/**
 * Environment-backed JWT settings used by the Jersey authentication flow.
 */
public class HrJwtConfig {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrJwtConfig.class);
    private static final String DEFAULT_SECRET = "hr-demo-jwt-secret-key-change-me";
    private static final long DEFAULT_EXPIRATION = 1_800_000L;
    private static final long DEFAULT_REFRESH_EXPIRATION = 604_800_000L;

    private String secret = System.getenv().getOrDefault("HR_JWT_SECRET", DEFAULT_SECRET);
    private long expiration = parseLong("HR_JWT_EXPIRATION_MS", DEFAULT_EXPIRATION);
    private long refreshExpiration = parseLong("HR_JWT_REFRESH_EXPIRATION_MS", DEFAULT_REFRESH_EXPIRATION);

    public static HrJwtConfig fromEnvironment() {
        return new HrJwtConfig();
    }

    private static long parseLong(String key, long fallback) {
        try {
            return Long.parseLong(System.getenv().getOrDefault(key, Long.toString(fallback)));
        } catch (NumberFormatException ex) {
            LOGGER.warn("Invalid numeric JWT config for key={} using fallback", key);
            return fallback;
        }
    }

    public String getSecret() { return secret; }
    public void setSecret(String secret) { this.secret = secret; }

    public long getExpiration() { return expiration; }
    public void setExpiration(long expiration) { this.expiration = expiration; }

    public long getRefreshExpiration() { return refreshExpiration; }
    public void setRefreshExpiration(long refreshExpiration) { this.refreshExpiration = refreshExpiration; }
}
