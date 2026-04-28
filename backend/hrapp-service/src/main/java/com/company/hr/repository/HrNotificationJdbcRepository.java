package com.company.hr.repository;

import com.company.hr.common.exception.HrApplicationException;
import com.company.hr.dto.response.HrNotificationDTO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * JDBC-backed notification repository for authenticated user pages.
 */
public class HrNotificationJdbcRepository extends HrJdbcRepository {

    private static final String FIND_FOR_USER_SQL =
            "SELECT n.notification_id, n.notification_type, n.title, n.message, n.reference_table, n.reference_id, n.is_read, n.created_at " +
            "FROM " + HrTables.NOTIFICATIONS + " n " +
            "JOIN " + HrTables.USERS + " u ON u.user_id = n.recipient_user_id " +
            "WHERE LOWER(u.username) = LOWER(?) " +
            "ORDER BY n.created_at DESC, n.notification_id DESC";

    private static final String MARK_READ_SQL =
            "UPDATE " + HrTables.NOTIFICATIONS + " n " +
            "SET is_read = 1 " +
            "WHERE n.notification_id = ? " +
            "  AND EXISTS (" +
            "    SELECT 1 FROM " + HrTables.USERS + " u " +
            "    WHERE u.user_id = n.recipient_user_id AND LOWER(u.username) = LOWER(?)" +
            "  )";

    private static final String MARK_ALL_READ_SQL =
            "UPDATE " + HrTables.NOTIFICATIONS + " n " +
            "SET is_read = 1 " +
            "WHERE EXISTS (" +
            "  SELECT 1 FROM " + HrTables.USERS + " u " +
            "  WHERE u.user_id = n.recipient_user_id AND LOWER(u.username) = LOWER(?)" +
            ")";

    public List<HrNotificationDTO> findForUsername(String username) {
        try (Connection connection = getConnection();
             PreparedStatement stmt = connection.prepareStatement(FIND_FOR_USER_SQL)) {
            stmt.setString(1, username);
            try (ResultSet rs = stmt.executeQuery()) {
                List<HrNotificationDTO> notifications = new ArrayList<>();
                while (rs.next()) {
                    notifications.add(mapRow(rs));
                }
                return notifications;
            }
        } catch (SQLException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    public boolean markRead(String username, long notificationId) {
        try (Connection connection = getConnection();
             PreparedStatement stmt = connection.prepareStatement(MARK_READ_SQL)) {
            stmt.setLong(1, notificationId);
            stmt.setString(2, username);
            return stmt.executeUpdate() > 0;
        } catch (SQLException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    public int markAllRead(String username) {
        try (Connection connection = getConnection();
             PreparedStatement stmt = connection.prepareStatement(MARK_ALL_READ_SQL)) {
            stmt.setString(1, username);
            return stmt.executeUpdate();
        } catch (SQLException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    private HrNotificationDTO mapRow(ResultSet rs) throws SQLException {
        String rawType = rs.getString("notification_type");
        Timestamp createdAt = rs.getTimestamp("created_at");
        return new HrNotificationDTO(
                rs.getLong("notification_id"),
                mapNotificationType(rawType),
                rs.getString("title"),
                rs.getString("message"),
                rs.getString("reference_table"),
                rs.getString("reference_id"),
                rs.getInt("is_read") == 1,
                createdAt == null ? null : createdAt.toInstant()
        );
    }

    private String mapNotificationType(String rawType) {
        if (rawType == null) {
            return "INFO";
        }
        return switch (rawType) {
            case "ACTION_COMPLETE" -> "SUCCESS";
            case "CONTRACT_EXPIRY" -> "WARNING";
            case "PROBATION_ALERT" -> "ALERT";
            default -> "INFO";
        };
    }
}
