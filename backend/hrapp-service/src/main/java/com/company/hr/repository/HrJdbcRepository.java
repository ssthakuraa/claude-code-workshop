package com.company.hr.repository;

import com.company.hr.common.i18n.HrLocaleContextHolder;
import com.company.hr.repository.jdbc.HrDbConnectionConfig;
import com.company.hr.repository.jdbc.HrJdbcClient;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

/**
 * Base class for the Jersey-era explicit JDBC repositories.
 */
public abstract class HrJdbcRepository {

    private final HrJdbcClient jdbcClient;

    protected HrJdbcRepository() {
        this(new HrJdbcClient(HrDbConnectionConfig.fromEnvironment()));
    }

    protected HrJdbcRepository(HrJdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    protected Connection getConnection() throws SQLException {
        return jdbcClient.getConnection();
    }

    protected String currentLocaleCode() {
        return HrLocaleContextHolder.getLocaleCode();
    }

    protected int bindCurrentLocale(PreparedStatement statement, int parameterIndex) throws SQLException {
        statement.setString(parameterIndex, currentLocaleCode());
        return parameterIndex + 1;
    }
}
