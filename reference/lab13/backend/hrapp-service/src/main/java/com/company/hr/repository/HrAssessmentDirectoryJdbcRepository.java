package com.company.hr.repository;

import com.company.hr.common.exception.HrApplicationException;
import com.company.hr.common.response.HrPagedResponse;
import com.company.hr.dto.response.HrAssessmentDirectoryRowDTO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * JDBC-backed list query for the HR assessments reviewer directory.
 */
public class HrAssessmentDirectoryJdbcRepository extends HrJdbcRepository {

    private static final String SELECT_COLUMNS =
            "SELECT a.assessment_id, " +
            "       employee.employee_id, " +
            "       TRIM(COALESCE(employee.first_name || ' ' || employee.last_name, employee.first_name, employee.last_name)) AS employee_name, " +
            "       employee.department_id, " +
            "       department.department_name, " +
            "       a.cycle_code, " +
            "       COALESCE(cycle_label_locale.translated_value, cycle_label_en.translated_value, cycle.default_label) AS cycle_label, " +
            "       a.review_status, " +
            "       a.goal_completion_pct, " +
            "       a.competency_score, " +
            "       a.reviewer_user_id, " +
            "       TRIM(COALESCE(reviewer.first_name || ' ' || reviewer.last_name, reviewer.first_name, reviewer.last_name)) AS reviewer_name, " +
            "       a.submitted_at, " +
            "       a.updated_at ";

    private static final String FROM_AND_JOINS =
            "FROM " + HrTables.ASSESSMENTS + " a " +
            "JOIN " + HrTables.EMPLOYEES + " employee ON employee.employee_id = a.employee_id AND employee.deleted_at IS NULL " +
            "LEFT JOIN " + HrTables.DEPARTMENTS + " department ON department.department_id = employee.department_id AND department.deleted_at IS NULL " +
            "JOIN " + HrTables.ASSESSMENT_CYCLES + " cycle ON cycle.cycle_code = a.cycle_code " +
            "LEFT JOIN " + HrTables.USERS + " reviewer_user ON reviewer_user.user_id = a.reviewer_user_id " +
            "LEFT JOIN " + HrTables.EMPLOYEES + " reviewer ON reviewer.employee_id = reviewer_user.employee_id AND reviewer.deleted_at IS NULL " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " cycle_label_locale ON cycle_label_locale.entity_type = 'ASSESSMENT_CYCLE' " +
            "  AND cycle_label_locale.entity_key = cycle.cycle_code " +
            "  AND cycle_label_locale.field_name = 'label' " +
            "  AND cycle_label_locale.locale_code = ? " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " cycle_label_en ON cycle_label_en.entity_type = 'ASSESSMENT_CYCLE' " +
            "  AND cycle_label_en.entity_key = cycle.cycle_code " +
            "  AND cycle_label_en.field_name = 'label' " +
            "  AND cycle_label_en.locale_code = 'en-US' ";

    public HrPagedResponse<HrAssessmentDirectoryRowDTO> findAll(int page,
                                                                int size,
                                                                String search,
                                                                String reviewStatus,
                                                                String cycleCode,
                                                                Integer departmentId,
                                                                Integer reviewerUserId,
                                                                Integer currentEmployeeId,
                                                                boolean managerScoped) {
        int resolvedPage = Math.max(0, page);
        int resolvedSize = size <= 0 ? 20 : Math.min(size, 100);

        SqlParts sqlParts = buildWhereClause(search, reviewStatus, cycleCode, departmentId, reviewerUserId, managerScoped);
        String cte = managerScoped ? buildManagerScopeCte() : "";
        String dataSql = cte + SELECT_COLUMNS + FROM_AND_JOINS + sqlParts.whereClause
                + " ORDER BY a.updated_at DESC, a.assessment_id DESC"
                + " OFFSET ? ROWS FETCH NEXT ? ROWS ONLY";
        String countSql = cte + "SELECT COUNT(*) " + FROM_AND_JOINS + sqlParts.whereClause;

        try (Connection connection = getConnection()) {
            long totalElements = executeCount(connection, countSql, sqlParts.parameters, currentEmployeeId, managerScoped);
            List<HrAssessmentDirectoryRowDTO> rows = executePageQuery(
                    connection,
                    dataSql,
                    sqlParts.parameters,
                    resolvedPage,
                    resolvedSize,
                    currentEmployeeId,
                    managerScoped
            );
            int totalPages = totalElements == 0 ? 0 : (int) Math.ceil((double) totalElements / resolvedSize);
            return HrPagedResponse.of(rows, totalElements, totalPages, resolvedPage, resolvedSize);
        } catch (SQLException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    private String buildManagerScopeCte() {
        return "WITH RECURSIVE manager_scope AS ("
                + " SELECT employee_id "
                + " FROM " + HrTables.EMPLOYEES + " "
                + " WHERE manager_id = ? AND deleted_at IS NULL "
                + " UNION ALL "
                + " SELECT child.employee_id "
                + " FROM " + HrTables.EMPLOYEES + " child "
                + " JOIN manager_scope scope ON child.manager_id = scope.employee_id "
                + " WHERE child.deleted_at IS NULL"
                + ") ";
    }

    private SqlParts buildWhereClause(String search,
                                      String reviewStatus,
                                      String cycleCode,
                                      Integer departmentId,
                                      Integer reviewerUserId,
                                      boolean managerScoped) {
        StringBuilder where = new StringBuilder("WHERE 1=1");
        List<Object> parameters = new ArrayList<>();

        if (managerScoped) {
            where.append(" AND employee.employee_id IN (SELECT employee_id FROM manager_scope)");
        }

        if (search != null && !search.isBlank()) {
            String trimmed = search.trim();
            String pattern = "%" + trimmed.toLowerCase() + "%";
            where.append(" AND LOWER(TRIM(COALESCE(employee.first_name || ' ' || employee.last_name, employee.first_name, employee.last_name))) LIKE ?");
            parameters.add(pattern);
        }

        if (reviewStatus != null && !reviewStatus.isBlank()) {
            where.append(" AND a.review_status = ?");
            parameters.add(reviewStatus.trim().toUpperCase());
        }

        if (cycleCode != null && !cycleCode.isBlank()) {
            where.append(" AND a.cycle_code = ?");
            parameters.add(cycleCode.trim().toUpperCase());
        }

        if (departmentId != null) {
            where.append(" AND employee.department_id = ?");
            parameters.add(departmentId);
        }

        if (reviewerUserId != null) {
            where.append(" AND a.reviewer_user_id = ?");
            parameters.add(reviewerUserId);
        }

        return new SqlParts(where.toString(), parameters);
    }

    private long executeCount(Connection connection,
                              String sql,
                              List<Object> parameters,
                              Integer currentEmployeeId,
                              boolean managerScoped) throws SQLException {
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            bindParameters(stmt, parameters, currentEmployeeId, managerScoped, false, 0, 0);
            try (ResultSet rs = stmt.executeQuery()) {
                rs.next();
                return rs.getLong(1);
            }
        }
    }

    private List<HrAssessmentDirectoryRowDTO> executePageQuery(Connection connection,
                                                               String sql,
                                                               List<Object> parameters,
                                                               int page,
                                                               int size,
                                                               Integer currentEmployeeId,
                                                               boolean managerScoped) throws SQLException {
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            bindParameters(stmt, parameters, currentEmployeeId, managerScoped, true, page, size);
            try (ResultSet rs = stmt.executeQuery()) {
                List<HrAssessmentDirectoryRowDTO> rows = new ArrayList<>();
                while (rs.next()) {
                    rows.add(mapRow(rs));
                }
                return rows;
            }
        }
    }

    private void bindParameters(PreparedStatement stmt,
                                List<Object> parameters,
                                Integer currentEmployeeId,
                                boolean managerScoped,
                                boolean paged,
                                int page,
                                int size) throws SQLException {
        int index = 1;
        if (managerScoped) {
            stmt.setInt(index++, currentEmployeeId);
        }
        index = bindCurrentLocale(stmt, index);
        for (Object parameter : parameters) {
            if (parameter instanceof Integer integerValue) {
                stmt.setInt(index++, integerValue);
            } else {
                stmt.setString(index++, String.valueOf(parameter));
            }
        }
        if (paged) {
            stmt.setInt(index++, page * size);
            stmt.setInt(index, size);
        }
    }

    private HrAssessmentDirectoryRowDTO mapRow(ResultSet rs) throws SQLException {
        HrAssessmentDirectoryRowDTO dto = new HrAssessmentDirectoryRowDTO();
        dto.setAssessmentId(getLong(rs, "assessment_id"));
        dto.setEmployeeId(getInteger(rs, "employee_id"));
        dto.setEmployeeName(rs.getString("employee_name"));
        dto.setDepartmentId(getInteger(rs, "department_id"));
        dto.setDepartmentName(rs.getString("department_name"));
        dto.setCycleCode(rs.getString("cycle_code"));
        dto.setCycleLabel(rs.getString("cycle_label"));
        dto.setReviewStatus(rs.getString("review_status"));
        dto.setGoalCompletionPct(rs.getBigDecimal("goal_completion_pct"));
        dto.setCompetencyScore(rs.getBigDecimal("competency_score"));
        dto.setReviewerUserId(getInteger(rs, "reviewer_user_id"));
        dto.setReviewerName(rs.getString("reviewer_name"));
        dto.setSubmittedAt(getLocalDateTime(rs, "submitted_at"));
        dto.setUpdatedAt(getLocalDateTime(rs, "updated_at"));
        return dto;
    }

    private Long getLong(ResultSet rs, String column) throws SQLException {
        long value = rs.getLong(column);
        return rs.wasNull() ? null : value;
    }

    private Integer getInteger(ResultSet rs, String column) throws SQLException {
        int value = rs.getInt(column);
        return rs.wasNull() ? null : value;
    }

    private LocalDateTime getLocalDateTime(ResultSet rs, String column) throws SQLException {
        Timestamp value = rs.getTimestamp(column);
        return value == null ? null : value.toLocalDateTime();
    }

    private record SqlParts(String whereClause, List<Object> parameters) {
    }
}
