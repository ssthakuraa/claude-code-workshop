package com.company.hr.repository.jdbc;

import com.company.hr.common.log.HrLogHelper;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

/**
 * Small JDBC helper for explicit PostgreSQL-backed repositories.
 */
public class HrJdbcClient {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrJdbcClient.class);
    private final HrDbConnectionConfig connectionConfig;

    public HrJdbcClient(HrDbConnectionConfig connectionConfig) {
        this.connectionConfig = connectionConfig;
    }

    public Connection getConnection() throws SQLException {
        DriverManager.setLoginTimeout(Math.max(1, connectionConfig.getConnectTimeoutMillis() / 1000));

        Properties properties = new Properties();
        properties.setProperty("user", connectionConfig.getUsername());
        properties.setProperty("password", connectionConfig.getPassword());
        properties.setProperty("connectTimeout", Integer.toString(Math.max(1, connectionConfig.getConnectTimeoutMillis() / 1000)));
        properties.setProperty("socketTimeout", Integer.toString(Math.max(1, connectionConfig.getReadTimeoutMillis() / 1000)));

        LOGGER.debug("Opening PostgreSQL JDBC connection to {}", connectionConfig.getJdbcUrl());
        return DriverManager.getConnection(connectionConfig.getJdbcUrl(), properties);
    }
}
