package com.company.hr.repository;

import com.company.hr.common.exception.HrApplicationException;
import com.company.hr.common.response.HrPagedResponse;
import com.company.hr.dto.response.HrAuditLogDTO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * JDBC-backed audit-log repository for Jersey read endpoints.
 */
public class HrAuditLogJdbcRepository extends HrJdbcRepository {

    private static final int MAX_PAGE_SIZE = 100;

    private static final String BASE_SQL =
            "FROM " + HrTables.AUDIT_LOGS + " al " +
            "WHERE (? IS NULL OR LOWER(al.table_name) = LOWER(?)) ";

    private static final String COUNT_SQL =
            "SELECT COUNT(*) " + BASE_SQL;

    private static final String PAGE_SQL =
            "SELECT al.audit_id, al.table_name, al.record_id, al.action, al.old_value, al.new_value, al.changed_by, al.changed_at " +
            BASE_SQL +
            "ORDER BY al.changed_at DESC, al.audit_id DESC " +
            "OFFSET ? ROWS FETCH NEXT ? ROWS ONLY";

    public HrPagedResponse<HrAuditLogDTO> findAll(int page, int size, String tableName) {
        int resolvedPage = Math.max(page, 0);
        int resolvedSize = Math.max(1, Math.min(size, MAX_PAGE_SIZE));
        String normalizedTableName = normalizeTableFilter(tableName);
        try (Connection connection = getConnection()) {
            long total = executeCount(connection, normalizedTableName);
            List<HrAuditLogDTO> rows = executePage(connection, resolvedPage, resolvedSize, normalizedTableName);
            int totalPages = total == 0 ? 0 : (int) Math.ceil((double) total / resolvedSize);
            return HrPagedResponse.of(rows, total, totalPages, resolvedPage, resolvedSize);
        } catch (SQLException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    private long executeCount(Connection connection, String tableName) throws SQLException {
        try (PreparedStatement stmt = connection.prepareStatement(COUNT_SQL)) {
            bindTableName(stmt, tableName);
            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next() ? rs.getLong(1) : 0;
            }
        }
    }

    private List<HrAuditLogDTO> executePage(Connection connection, int page, int size, String tableName) throws SQLException {
        try (PreparedStatement stmt = connection.prepareStatement(PAGE_SQL)) {
            bindTableName(stmt, tableName);
            stmt.setInt(3, page * size);
            stmt.setInt(4, size);
            try (ResultSet rs = stmt.executeQuery()) {
                List<HrAuditLogDTO> rows = new ArrayList<>();
                while (rs.next()) {
                    HrAuditLogDTO dto = new HrAuditLogDTO();
                    dto.setAuditId(rs.getLong("audit_id"));
                    dto.setTableName(stripPrefix(rs.getString("table_name")));
                    dto.setRecordId(rs.getString("record_id"));
                    dto.setAction(rs.getString("action"));
                    dto.setOldValue(rs.getString("old_value"));
                    dto.setNewValue(rs.getString("new_value"));
                    int changedBy = rs.getInt("changed_by");
                    dto.setChangedBy(rs.wasNull() ? null : changedBy);
                    Timestamp changedAt = rs.getTimestamp("changed_at");
                    dto.setChangedAt(changedAt == null ? null : changedAt.toInstant());
                    rows.add(dto);
                }
                return rows;
            }
        }
    }

    private void bindTableName(PreparedStatement stmt, String tableName) throws SQLException {
        stmt.setString(1, tableName);
        stmt.setString(2, tableName);
    }

    private String normalizeTableFilter(String tableName) {
        if (tableName == null || tableName.isBlank()) {
            return null;
        }
        String normalized = tableName.trim().toUpperCase(Locale.ROOT);
        return normalized.startsWith("AIHR_") ? normalized : "AIHR_" + normalized;
    }

    private String stripPrefix(String tableName) {
        if (tableName == null) {
            return null;
        }
        return tableName.toLowerCase(Locale.ROOT).replaceFirst("^aihr_", "");
    }
}
