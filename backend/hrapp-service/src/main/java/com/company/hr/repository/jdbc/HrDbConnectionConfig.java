package com.company.hr.repository.jdbc;

import com.company.hr.common.log.HrLogHelper;

import java.util.Map;
import java.util.Objects;

/**
 * Configuration data for connecting to the PostgreSQL AIHR database.
 */
public final class HrDbConnectionConfig {
    private static final HrLogHelper LOGGER = new HrLogHelper(HrDbConnectionConfig.class);
    private static final String DEFAULT_HOSTNAME = "localhost";
    private static final int DEFAULT_PORT = 5432;
    private static final String DEFAULT_DATABASE_NAME = "hrdb";
    private static final String DEFAULT_USERNAME = "hrapp";
    private static final String DEFAULT_PASSWORD = "hrapp";
    private static final int DEFAULT_CONNECT_TIMEOUT_MILLIS = 5000;
    private static final int DEFAULT_READ_TIMEOUT_MILLIS = 30000;

    private final String hostname;
    private final int port;
    private final String databaseName;
    private final String username;
    private final String password;
    private final int connectTimeoutMillis;
    private final int readTimeoutMillis;

    private HrDbConnectionConfig(String hostname,
                                 int port,
                                 String databaseName,
                                 String username,
                                 String password,
                                 int connectTimeoutMillis,
                                 int readTimeoutMillis) {
        this.hostname = Objects.requireNonNull(hostname, "hostname");
        this.port = port;
        this.databaseName = Objects.requireNonNull(databaseName, "databaseName");
        this.username = Objects.requireNonNull(username, "username");
        this.password = Objects.requireNonNull(password, "password");
        this.connectTimeoutMillis = connectTimeoutMillis;
        this.readTimeoutMillis = readTimeoutMillis;
    }

    public static HrDbConnectionConfig fromEnvironment() {
        Map<String, String> env = System.getenv();
        String host = firstNonEmptyOrDefault(env, DEFAULT_HOSTNAME, "AIHR_DB_HOSTNAME", "DB_HOSTNAME", "DB_HOST");
        int port = parseInt(firstNonEmptyOrDefault(env, Integer.toString(DEFAULT_PORT), "AIHR_DB_PORT", "DB_PORT"), DEFAULT_PORT);
        String databaseName = firstNonEmptyOrDefault(env, DEFAULT_DATABASE_NAME, "AIHR_DB_NAME", "DB_NAME", "AIHR_DB_SERVICE_NAME", "DB_SERVICE_NAME", "DB_SSID");
        String username = firstNonEmptyOrDefault(env, DEFAULT_USERNAME, "AIHR_DB_USER", "DB_APP_USER", "DB_USER");
        String password = firstNonEmptyOrDefault(env, DEFAULT_PASSWORD, "AIHR_DB_PASSWORD", "DB_APP_PASSWORD", "DB_PASSWORD");
        int connectTimeoutMillis = parseInt(
                firstNonEmptyOrDefault(env, Integer.toString(DEFAULT_CONNECT_TIMEOUT_MILLIS),
                        "AIHR_DB_CONNECT_TIMEOUT_MILLIS", "DB_CONNECT_TIMEOUT_MILLIS"),
                DEFAULT_CONNECT_TIMEOUT_MILLIS
        );
        int readTimeoutMillis = parseInt(
                firstNonEmptyOrDefault(env, Integer.toString(DEFAULT_READ_TIMEOUT_MILLIS),
                        "AIHR_DB_READ_TIMEOUT_MILLIS", "DB_READ_TIMEOUT_MILLIS"),
                DEFAULT_READ_TIMEOUT_MILLIS
        );
        LOGGER.debug("Loaded DB config host={} port={} databaseName={}", host, port, databaseName);
        return new HrDbConnectionConfig(host, port, databaseName, username, password, connectTimeoutMillis, readTimeoutMillis);
    }

    private static String firstNonEmptyOrDefault(Map<String, String> env, String fallback, String... keys) {
        String value = firstNonEmpty(env, keys);
        if (value.isBlank()) {
            return fallback;
        }
        return value;
    }

    private static String firstNonEmpty(Map<String, String> env, String... keys) {
        for (String key : keys) {
            String value = env.get(key);
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return "";
    }

    private static int parseInt(String value, int fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException ex) {
            LOGGER.warn("Invalid numeric DB config value using fallback");
            return fallback;
        }
    }

    public String getHostname() {
        return hostname;
    }

    public int getPort() {
        return port;
    }

    public String getDatabaseName() {
        return databaseName;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public int getConnectTimeoutMillis() {
        return connectTimeoutMillis;
    }

    public int getReadTimeoutMillis() {
        return readTimeoutMillis;
    }

    public String getJdbcUrl() {
        return String.format("jdbc:postgresql://%s:%d/%s", hostname, port, databaseName);
    }

    @Override
    public String toString() {
        return "HrDbConnectionConfig{" +
                "hostname='" + hostname + '\'' +
                ", port=" + port +
                ", databaseName='" + databaseName + '\'' +
                ", username='" + username + '\'' +
                ", connectTimeoutMillis=" + connectTimeoutMillis +
                ", readTimeoutMillis=" + readTimeoutMillis +
                '}';
    }
}
