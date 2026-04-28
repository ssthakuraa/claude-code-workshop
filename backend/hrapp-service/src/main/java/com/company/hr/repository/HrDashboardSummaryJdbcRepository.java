package com.company.hr.repository;

import com.company.hr.common.exception.HrApplicationException;
import com.company.hr.common.i18n.HrLocaleContextHolder;
import com.company.hr.common.i18n.HrMessageSource;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.company.hr.dto.response.HrDashboardSummaryDTO;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * JDBC-backed dashboard summary repository for the first Jersey read endpoints.
 */
public class HrDashboardSummaryJdbcRepository extends HrJdbcRepository {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final String MANAGER_SCOPE_CTE =
            "WITH RECURSIVE manager_scope AS ("
                    + " SELECT employee_id "
                    + " FROM " + HrTables.EMPLOYEES + " "
                    + " WHERE manager_id = ? AND deleted_at IS NULL "
                    + " UNION ALL "
                    + " SELECT child.employee_id "
                    + " FROM " + HrTables.EMPLOYEES + " child "
                    + " JOIN manager_scope scope ON child.manager_id = scope.employee_id "
                    + " WHERE child.deleted_at IS NULL"
                    + ") ";

    private static final String EMPLOYEE_SCOPE_BASE =
            " FROM " + HrTables.EMPLOYEES + " e WHERE e.deleted_at IS NULL";
    private static final String DEPARTMENT_HEADCOUNT_SQL =
            "SELECT d.department_name, COUNT(*) AS cnt " +
                    "FROM " + HrTables.EMPLOYEES + " e " +
                    "JOIN " + HrTables.DEPARTMENTS + " d ON e.department_id = d.department_id " +
                    "WHERE e.deleted_at IS NULL AND d.deleted_at IS NULL AND e.employment_status = 'ACTIVE' " +
                    "GROUP BY d.department_name " +
                    "ORDER BY cnt DESC";
    private static final String COUNTRY_HEADCOUNT_SQL =
            "SELECT c.country_name, COUNT(*) AS cnt " +
                    "FROM " + HrTables.EMPLOYEES + " e " +
                    "JOIN " + HrTables.DEPARTMENTS + " d ON d.department_id = e.department_id AND d.deleted_at IS NULL " +
                    "JOIN " + HrTables.LOCATIONS + " l ON l.location_id = d.location_id " +
                    "JOIN " + HrTables.COUNTRIES + " c ON c.country_id = l.country_id " +
                    "WHERE e.deleted_at IS NULL AND e.employment_status = 'ACTIVE' " +
                    "GROUP BY c.country_name " +
                    "ORDER BY cnt DESC, c.country_name";
    private static final String ATTRITION_SQL =
            "SELECT TO_CHAR(al.changed_at, 'YYYY-MM') AS month_key, COUNT(*) AS cnt " +
                    "FROM " + HrTables.AUDIT_LOGS + " al " +
                    "JOIN " + HrTables.EMPLOYEES + " e ON e.employee_id = CAST(al.record_id AS INTEGER) " +
                    "WHERE LOWER(al.table_name) = LOWER('" + HrTables.EMPLOYEES + "') " +
                    "  AND e.deleted_at IS NULL " +
                    "  AND al.action = 'UPDATE' " +
                    "  AND al.changed_at >= ? " +
                    "  AND al.new_value ->> 'employment_status' = 'TERMINATED' " +
                    "GROUP BY TO_CHAR(al.changed_at, 'YYYY-MM') " +
                    "ORDER BY month_key";
    private static final String RECENT_ACTIVITY_SQL =
            "SELECT al.record_id, al.action, al.old_value, al.new_value, al.changed_at " +
                    "FROM " + HrTables.AUDIT_LOGS + " al " +
                    "JOIN " + HrTables.EMPLOYEES + " e ON e.employee_id = CAST(al.record_id AS INTEGER) " +
                    "WHERE LOWER(al.table_name) = LOWER('" + HrTables.EMPLOYEES + "') " +
                    "  AND e.deleted_at IS NULL " +
                    "ORDER BY al.changed_at DESC, al.audit_id DESC " +
                    "FETCH FIRST 8 ROWS ONLY";

    public HrDashboardSummaryDTO fetchSummary() {
        return fetchSummary(null, false);
    }

    public HrDashboardSummaryDTO fetchSummary(Integer currentEmployeeId, boolean managerScoped) {
        try (Connection connection = getConnection()) {
            HrDashboardSummaryDTO dto = new HrDashboardSummaryDTO();
            dto.setTotalHeadcount(executeCount(connection, buildScopedEmployeeCountSql(null, managerScoped), currentEmployeeId, managerScoped));
            dto.setActiveCount(executeCount(connection, buildScopedEmployeeCountSql("ACTIVE", managerScoped), currentEmployeeId, managerScoped, "ACTIVE"));
            dto.setOnLeaveCount(executeCount(connection, buildScopedEmployeeCountSql("ON_LEAVE", managerScoped), currentEmployeeId, managerScoped, "ON_LEAVE"));
            dto.setProbationCount(executeCount(connection, buildScopedEmployeeCountSql("PROBATION", managerScoped), currentEmployeeId, managerScoped, "PROBATION"));
            dto.setNewHiresThisMonth(executeDateCount(connection, buildScopedNewHireSql(managerScoped), currentEmployeeId, managerScoped, LocalDate.now().withDayOfMonth(1)));
            dto.setTerminationsThisMonth(executeCount(connection, buildScopedEmployeeCountSql("TERMINATED", managerScoped), currentEmployeeId, managerScoped, "TERMINATED"));
            dto.setHeadcountByDepartment(executeDepartmentCounts(connection, currentEmployeeId, managerScoped));
            dto.setHeadcountByStatus(executeStatusBreakdown(connection, currentEmployeeId, managerScoped));
            dto.setHeadcountByCountry(executeCountryCounts(connection, currentEmployeeId, managerScoped));
            setAttritionTrend(connection, dto, currentEmployeeId, managerScoped);
            dto.setRecentActivity(executeRecentActivity(connection, currentEmployeeId, managerScoped));
            return dto;
        } catch (SQLException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    private String buildScopedEmployeeCountSql(String status, boolean managerScoped) {
        StringBuilder sql = new StringBuilder();
        if (managerScoped) {
            sql.append(MANAGER_SCOPE_CTE);
        }
        sql.append("SELECT COUNT(*)").append(EMPLOYEE_SCOPE_BASE);
        if (managerScoped) {
            sql.append(" AND e.employee_id IN (SELECT employee_id FROM manager_scope)");
        }
        if (status != null) {
            sql.append(" AND e.employment_status = ?");
        }
        return sql.toString();
    }

    private String buildScopedNewHireSql(boolean managerScoped) {
        StringBuilder sql = new StringBuilder();
        if (managerScoped) {
            sql.append(MANAGER_SCOPE_CTE);
        }
        sql.append("SELECT COUNT(*)").append(EMPLOYEE_SCOPE_BASE);
        if (managerScoped) {
            sql.append(" AND e.employee_id IN (SELECT employee_id FROM manager_scope)");
        }
        sql.append(" AND e.hire_date >= ?");
        return sql.toString();
    }

    private String withManagerScope(String sql, boolean managerScoped, String employeeAlias) {
        if (!managerScoped) {
            return sql;
        }
        int whereIndex = sql.indexOf("WHERE ");
        String scopedSql = sql;
        if (whereIndex >= 0) {
            scopedSql = sql.substring(0, whereIndex + 6)
                    + employeeAlias + ".employee_id IN (SELECT employee_id FROM manager_scope) AND "
                    + sql.substring(whereIndex + 6);
        }
        return MANAGER_SCOPE_CTE + scopedSql;
    }

    private long executeCount(Connection connection,
                              String sql,
                              Integer currentEmployeeId,
                              boolean managerScoped,
                              Object... params) throws SQLException {
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            bindParameters(statement, currentEmployeeId, managerScoped, params);
            try (ResultSet rs = statement.executeQuery()) {
                return rs.next() ? rs.getLong(1) : 0;
            }
        }
    }

    private long executeDateCount(Connection connection,
                                  String sql,
                                  Integer currentEmployeeId,
                                  boolean managerScoped,
                                  LocalDate startDate) throws SQLException {
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            bindParameters(statement, currentEmployeeId, managerScoped, startDate);
            try (ResultSet rs = statement.executeQuery()) {
                return rs.next() ? rs.getLong(1) : 0;
            }
        }
    }

    private List<HrDashboardSummaryDTO.DeptCount> executeDepartmentCounts(Connection connection,
                                                                          Integer currentEmployeeId,
                                                                          boolean managerScoped) throws SQLException {
        try (PreparedStatement statement = connection.prepareStatement(withManagerScope(DEPARTMENT_HEADCOUNT_SQL, managerScoped, "e"))) {
            bindParameters(statement, currentEmployeeId, managerScoped);
            try (ResultSet rs = statement.executeQuery()) {
                List<HrDashboardSummaryDTO.DeptCount> counts = new ArrayList<>();
                while (rs.next()) {
                    counts.add(new HrDashboardSummaryDTO.DeptCount(rs.getString("department_name"), rs.getLong("cnt")));
                }
                return counts;
            }
        }
    }

    private List<HrDashboardSummaryDTO.StatusCount> executeStatusBreakdown(Connection connection,
                                                                           Integer currentEmployeeId,
                                                                           boolean managerScoped) throws SQLException {
        String sql = withManagerScope(
                "SELECT e.employment_status, COUNT(*) AS cnt " + EMPLOYEE_SCOPE_BASE + " GROUP BY e.employment_status",
                managerScoped,
                "e"
        );
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            bindParameters(statement, currentEmployeeId, managerScoped);
            try (ResultSet rs = statement.executeQuery()) {
                List<HrDashboardSummaryDTO.StatusCount> counts = new ArrayList<>();
                while (rs.next()) {
                    counts.add(new HrDashboardSummaryDTO.StatusCount(rs.getString("employment_status"), rs.getLong("cnt")));
                }
                return counts;
            }
        }
    }

    private List<HrDashboardSummaryDTO.CountryCount> executeCountryCounts(Connection connection,
                                                                          Integer currentEmployeeId,
                                                                          boolean managerScoped) throws SQLException {
        try (PreparedStatement statement = connection.prepareStatement(withManagerScope(COUNTRY_HEADCOUNT_SQL, managerScoped, "e"))) {
            bindParameters(statement, currentEmployeeId, managerScoped);
            try (ResultSet rs = statement.executeQuery()) {
                List<HrDashboardSummaryDTO.CountryCount> counts = new ArrayList<>();
                while (rs.next()) {
                    counts.add(new HrDashboardSummaryDTO.CountryCount(rs.getString("country_name"), rs.getLong("cnt")));
                }
                return counts;
            }
        }
    }

    private void setAttritionTrend(Connection connection,
                                   HrDashboardSummaryDTO dto,
                                   Integer currentEmployeeId,
                                   boolean managerScoped) throws SQLException {
        YearMonth currentMonth = YearMonth.now();
        YearMonth startMonth = currentMonth.minusMonths(11);
        Map<YearMonth, Long> countsByMonth = new LinkedHashMap<>();
        for (int i = 0; i < 12; i++) {
            YearMonth month = startMonth.plusMonths(i);
            countsByMonth.put(month, 0L);
        }

        try (PreparedStatement statement = connection.prepareStatement(withManagerScope(ATTRITION_SQL, managerScoped, "e"))) {
            bindParameters(statement, currentEmployeeId, managerScoped, startMonth.atDay(1));
            try (ResultSet rs = statement.executeQuery()) {
                while (rs.next()) {
                    YearMonth month = YearMonth.parse(rs.getString("month_key"));
                    countsByMonth.put(month, rs.getLong("cnt"));
                }
            }
        }

        List<HrDashboardSummaryDTO.AttritionPoint> trend = new ArrayList<>();
        Locale locale = HrLocaleContextHolder.get().locale();
        for (Map.Entry<YearMonth, Long> entry : countsByMonth.entrySet()) {
            String label = entry.getKey().getMonth().getDisplayName(TextStyle.SHORT, locale);
            trend.add(new HrDashboardSummaryDTO.AttritionPoint(label, entry.getValue()));
        }
        dto.setAttritionTrend(trend);
    }

    private List<HrDashboardSummaryDTO.RecentActivity> executeRecentActivity(Connection connection,
                                                                             Integer currentEmployeeId,
                                                                             boolean managerScoped) throws SQLException {
        try (PreparedStatement statement = connection.prepareStatement(withManagerScope(RECENT_ACTIVITY_SQL, managerScoped, "e"))) {
            bindParameters(statement, currentEmployeeId, managerScoped);
            try (ResultSet rs = statement.executeQuery()) {
                List<HrDashboardSummaryDTO.RecentActivity> rows = new ArrayList<>();
                while (rs.next()) {
                    rows.add(mapRecentActivity(rs));
                }
                return rows;
            }
        }
    }

    private void bindParameters(PreparedStatement statement,
                                Integer currentEmployeeId,
                                boolean managerScoped,
                                Object... params) throws SQLException {
        int index = 1;
        if (managerScoped) {
            statement.setInt(index++, currentEmployeeId);
        }
        for (Object param : params) {
            if (param instanceof String value) {
                statement.setString(index++, value);
            } else if (param instanceof LocalDate value) {
                statement.setDate(index++, Date.valueOf(value));
            } else if (param instanceof Date value) {
                statement.setDate(index++, value);
            } else {
                statement.setObject(index++, param);
            }
        }
    }

    private HrDashboardSummaryDTO.RecentActivity mapRecentActivity(ResultSet rs) throws SQLException {
        String oldValue = rs.getString("old_value");
        String newValue = rs.getString("new_value");
        JsonNode oldNode = readJson(oldValue);
        JsonNode newNode = readJson(newValue);
        String action = rs.getString("action");
        String recordId = rs.getString("record_id");

        String type = "SYSTEM";
        String text = HrMessageSource.get("hr.dashboard.activity.system.updated");
        if ("INSERT".equals(action)) {
            type = "HIRE";
            text = HrMessageSource.get("hr.dashboard.activity.hire", fullName(newNode));
        } else if (newNode != null && "TERMINATED".equals(textValue(newNode, "employment_status"))) {
            type = "TERMINATE";
            text = HrMessageSource.get(
                    "hr.dashboard.activity.terminate",
                    fallbackValue(recordId, HrMessageSource.get("hr.dashboard.activity.recordFallback"))
            );
        } else if (fieldChanged(oldNode, newNode, "department_id")) {
            type = "TRANSFER";
            text = HrMessageSource.get(
                    "hr.dashboard.activity.transfer",
                    fallbackValue(recordId, HrMessageSource.get("hr.dashboard.activity.recordFallback")),
                    textValue(newNode, "department_id", HrMessageSource.get("hr.dashboard.activity.updatedFallback"))
            );
        } else if (fieldChanged(oldNode, newNode, "job_id")) {
            type = "PROMOTE";
            text = HrMessageSource.get(
                    "hr.dashboard.activity.promote",
                    fallbackValue(recordId, HrMessageSource.get("hr.dashboard.activity.recordFallback")),
                    textValue(newNode, "job_id", HrMessageSource.get("hr.dashboard.activity.updatedFallback"))
            );
        } else if (fieldChanged(oldNode, newNode, "salary")) {
            type = "SYSTEM";
            text = HrMessageSource.get(
                    "hr.dashboard.activity.system.compensation",
                    fallbackValue(recordId, HrMessageSource.get("hr.dashboard.activity.recordFallback"))
            );
        }

        return new HrDashboardSummaryDTO.RecentActivity(
                type,
                text,
                rs.getTimestamp("changed_at").toInstant()
        );
    }

    private JsonNode readJson(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return OBJECT_MAPPER.readTree(value);
        } catch (Exception ex) {
            return null;
        }
    }

    private boolean fieldChanged(JsonNode oldNode, JsonNode newNode, String field) {
        String oldValue = textValue(oldNode, field);
        String newValue = textValue(newNode, field);
        return newValue != null && !newValue.equals(oldValue);
    }

    private String textValue(JsonNode node, String field) {
        return textValue(node, field, null);
    }

    private String textValue(JsonNode node, String field, String fallback) {
        if (node == null || field == null || !node.hasNonNull(field)) {
            return fallback;
        }
        return node.get(field).asText();
    }

    private String fullName(JsonNode node) {
        String firstName = textValue(node, "first_name", "");
        String lastName = textValue(node, "last_name", "");
        String fullName = (firstName + " " + lastName).trim();
        return fullName.isBlank() ? HrMessageSource.get("hr.dashboard.activity.employeeFallback") : fullName;
    }

    private String fallbackValue(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }
}
