package com.company.hr.repository;

import com.company.hr.common.exception.HrApplicationException;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;

/**
 * JDBC-backed authentication repository against AIHR auth tables.
 */
public class HrAuthJdbcRepository extends HrJdbcRepository {

    private static final String FIND_BY_USERNAME_SQL =
            "SELECT " +
            "  u.user_id, " +
            "  u.employee_id, " +
            "  u.username, " +
            "  u.password_hash, " +
            "  u.is_active, " +
            "  u.last_login, " +
            "  TRIM(COALESCE(e.first_name || ' ' || e.last_name, e.first_name, e.last_name)) AS full_name, " +
            "  r.role_name " +
            "FROM " + HrTables.USERS + " u " +
            "LEFT JOIN " + HrTables.EMPLOYEES + " e ON e.employee_id = u.employee_id AND e.deleted_at IS NULL " +
            "LEFT JOIN " + HrTables.USER_ROLES + " ur ON ur.user_id = u.user_id " +
            "LEFT JOIN " + HrTables.ROLES + " r ON r.role_id = ur.role_id " +
            "WHERE LOWER(u.username) = LOWER(?) " +
            "ORDER BY r.role_name";

    private static final String UPDATE_LAST_LOGIN_SQL =
            "UPDATE " + HrTables.USERS + " SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?";

    public Optional<HrAuthUserRecord> findByUsername(String username) {
        if (username == null || username.isBlank()) {
            return Optional.empty();
        }

        try (Connection connection = getConnection();
             PreparedStatement stmt = connection.prepareStatement(FIND_BY_USERNAME_SQL)) {
            stmt.setString(1, username.trim());
            try (ResultSet rs = stmt.executeQuery()) {
                if (!rs.next()) {
                    return Optional.empty();
                }

                Integer userId = rs.getInt("user_id");
                Integer employeeId = getInteger(rs, "employee_id");
                String resolvedUsername = rs.getString("username");
                String passwordHash = rs.getString("password_hash");
                boolean active = rs.getInt("is_active") == 1;
                Instant lastLogin = getInstant(rs, "last_login");
                String fullName = rs.getString("full_name");
                LinkedHashSet<String> roles = new LinkedHashSet<>();

                addRole(rs, roles);
                while (rs.next()) {
                    addRole(rs, roles);
                }

                String resolvedFullName = (fullName == null || fullName.isBlank()) ? resolvedUsername : fullName;
                return Optional.of(new HrAuthUserRecord(
                        userId,
                        employeeId,
                        resolvedUsername,
                        passwordHash,
                        active,
                        lastLogin,
                        resolvedFullName,
                        List.copyOf(roles)
                ));
            }
        } catch (SQLException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    public void updateLastLogin(Integer userId, Instant lastLogin) {
        if (userId == null || lastLogin == null) {
            return;
        }

        try (Connection connection = getConnection();
             PreparedStatement stmt = connection.prepareStatement(UPDATE_LAST_LOGIN_SQL)) {
            stmt.setInt(1, userId);
            stmt.executeUpdate();
        } catch (SQLException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    private void addRole(ResultSet rs, LinkedHashSet<String> roles) throws SQLException {
        String roleName = rs.getString("role_name");
        if (roleName != null && !roleName.isBlank()) {
            roles.add(roleName);
        }
    }

    private Integer getInteger(ResultSet rs, String column) throws SQLException {
        int value = rs.getInt(column);
        return rs.wasNull() ? null : value;
    }

    private Instant getInstant(ResultSet rs, String column) throws SQLException {
        Timestamp value = rs.getTimestamp(column);
        return value == null ? null : value.toInstant();
    }
}
