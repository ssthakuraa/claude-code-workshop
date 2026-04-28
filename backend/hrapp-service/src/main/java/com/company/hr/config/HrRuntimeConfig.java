package com.company.hr.config;

import com.company.hr.common.log.HrLogHelper;

import java.net.URI;
import java.util.Arrays;
import java.util.List;

/**
 * Environment-driven runtime settings for the Jersey bootstrap.
 */
public record HrRuntimeConfig(
        String host,
        int port,
        String basePath,
        List<String> corsAllowedOrigins
) {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrRuntimeConfig.class);
    private static final String DEFAULT_HOST = "0.0.0.0";
    private static final int DEFAULT_PORT = 18082;
    private static final String DEFAULT_BASE_PATH = "/app/hr/api/v1";
    private static final String DEFAULT_CORS_ORIGINS =
            "http://localhost:5182,http://127.0.0.1:5182,http://localhost:*,http://127.0.0.1:*";

    public static HrRuntimeConfig fromEnvironment() {
        HrRuntimeConfig runtimeConfig = new HrRuntimeConfig(
                envOrDefault("HR_APP_HOST", DEFAULT_HOST),
                intEnvOrDefault("HR_APP_PORT", DEFAULT_PORT),
                normalizeBasePath(envOrDefault("HR_APP_BASE_PATH", DEFAULT_BASE_PATH)),
                parseCsv(envOrDefault("HR_CORS_ALLOWED_ORIGINS", DEFAULT_CORS_ORIGINS))
        );
        LOGGER.debug("Loaded runtime config host={} port={} basePath={}",
                runtimeConfig.host(), runtimeConfig.port(), runtimeConfig.basePath());
        return runtimeConfig;
    }

    public URI baseUri() {
        return URI.create("http://" + host + ":" + port + basePath + "/");
    }

    private static String envOrDefault(String key, String defaultValue) {
        String value = System.getenv(key);
        if (value == null || value.isBlank()) {
            return defaultValue;
        }
        return value.trim();
    }

    private static int intEnvOrDefault(String key, int defaultValue) {
        String value = System.getenv(key);
        if (value == null || value.isBlank()) {
            return defaultValue;
        }
        return Integer.parseInt(value.trim());
    }

    private static List<String> parseCsv(String csv) {
        return Arrays.stream(csv.split(","))
                .map(String::trim)
                .filter(value -> !value.isEmpty())
                .toList();
    }

    private static String normalizeBasePath(String basePath) {
        String normalized = basePath == null || basePath.isBlank() ? DEFAULT_BASE_PATH : basePath.trim();
        if (!normalized.startsWith("/")) {
            normalized = "/" + normalized;
        }
        while (normalized.endsWith("/") && normalized.length() > 1) {
            normalized = normalized.substring(0, normalized.length() - 1);
        }
        return normalized;
    }
}
