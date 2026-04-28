package com.company.hr.repository;

import com.company.hr.common.exception.HrApplicationException;
import com.company.hr.dto.response.HrEmployeeDetailDTO;
import com.company.hr.dto.response.HrEmployeeSummaryDTO;
import com.company.hr.dto.response.HrJobHistoryDTO;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Explicit JDBC-backed employee repository for Jersey-era list/detail reads.
 */
public class HrEmployeeJdbcRepository extends HrJdbcRepository {

    private static final String EMPLOYEE_COLUMNS =
            "SELECT " +
            "  e.employee_id, " +
            "  e.first_name, " +
            "  e.last_name, " +
            "  TRIM(COALESCE(e.first_name || ' ' || e.last_name, e.first_name, e.last_name)) AS full_name, " +
            "  e.email, " +
            "  e.phone_number, " +
            "  e.hire_date, " +
            "  e.job_id, " +
            "  j.job_title, " +
            "  e.salary, " +
            "  e.commission_pct, " +
            "  e.manager_id, " +
            "  TRIM(COALESCE(m.first_name || ' ' || m.last_name, m.first_name, m.last_name)) AS manager_name, " +
            "  e.department_id, " +
            "  d.department_name, " +
            "  l.city AS location_city, " +
            "  e.employment_status, " +
            "  e.employment_type, " +
            "  e.contract_end_date ";

    private static final String EMPLOYEE_FROM =
            "FROM " + HrTables.EMPLOYEES + " e " +
            "LEFT JOIN " + HrTables.JOBS + " j ON j.job_id = e.job_id " +
            "LEFT JOIN " + HrTables.EMPLOYEES + " m ON m.employee_id = e.manager_id AND m.deleted_at IS NULL " +
            "LEFT JOIN " + HrTables.DEPARTMENTS + " d ON d.department_id = e.department_id AND d.deleted_at IS NULL " +
            "LEFT JOIN " + HrTables.LOCATIONS + " l ON l.location_id = d.location_id " +
            "LEFT JOIN " + HrTables.COUNTRIES + " c ON c.country_id = l.country_id ";

    private static final String JOB_HISTORY_SQL =
            "SELECT " +
            "  h.start_date, " +
            "  h.end_date, " +
            "  h.job_id, " +
            "  j.job_title, " +
            "  h.department_id, " +
            "  d.department_name " +
            "FROM " + HrTables.JOB_HISTORY + " h " +
            "LEFT JOIN " + HrTables.JOBS + " j ON j.job_id = h.job_id " +
            "LEFT JOIN " + HrTables.DEPARTMENTS + " d ON d.department_id = h.department_id " +
            "WHERE h.employee_id = ? " +
            "ORDER BY h.start_date DESC";

    private static final Map<String, String> SORT_COLUMNS = Map.of(
            "employeeId", "e.employee_id",
            "firstName", "e.first_name",
            "lastName", "e.last_name",
            "hireDate", "e.hire_date DESC, e.employee_id",
            "salary", "e.salary DESC NULLS LAST, e.employee_id",
            "departmentName", "d.department_name, e.last_name, e.first_name",
            "jobTitle", "j.job_title, e.last_name, e.first_name"
    );

    public EmployeePage findAll(int page, int size, String sort, String search, Integer departmentId, String status) {
        return findAll(page, size, sort, search, departmentId, status, null, null);
    }

    public EmployeePage findAll(int page,
                                int size,
                                String sort,
                                String search,
                                Integer departmentId,
                                String status,
                                LocalDate hireDateFrom,
                                LocalDate hireDateTo) {
        int resolvedPage = Math.max(0, page);
        int resolvedSize = size <= 0 ? 10 : Math.min(size, 100);

        SqlParts sqlParts = buildWhereClause(search, departmentId, status, hireDateFrom, hireDateTo);
        String orderBy = resolveSort(sort);
        String dataSql = EMPLOYEE_COLUMNS + EMPLOYEE_FROM + sqlParts.whereClause()
                + " ORDER BY " + orderBy
                + " OFFSET ? ROWS FETCH NEXT ? ROWS ONLY";
        String countSql = "SELECT COUNT(*) " + EMPLOYEE_FROM + sqlParts.whereClause();

        try (Connection connection = getConnection()) {
            long totalElements = executeCount(connection, countSql, sqlParts.parameters());
            List<HrEmployeeSummaryDTO> employees = executePageQuery(
                    connection,
                    dataSql,
                    sqlParts.parameters(),
                    resolvedPage,
                    resolvedSize
            );
            int totalPages = totalElements == 0 ? 0 : (int) Math.ceil((double) totalElements / resolvedSize);
            return new EmployeePage(employees, totalElements, totalPages, resolvedPage, resolvedSize);
        } catch (SQLException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    public Optional<HrEmployeeDetailDTO> findById(Integer employeeId) {
        return findByIdInternal(employeeId, true);
    }

    public Optional<HrEmployeeDetailDTO> findByIdIncludingDeleted(Integer employeeId) {
        return findByIdInternal(employeeId, false);
    }

    private Optional<HrEmployeeDetailDTO> findByIdInternal(Integer employeeId, boolean excludeDeleted) {
        if (employeeId == null) {
            return Optional.empty();
        }

        String sql = EMPLOYEE_COLUMNS + EMPLOYEE_FROM
                + (excludeDeleted ? "WHERE e.deleted_at IS NULL AND e.employee_id = ?" : "WHERE e.employee_id = ?");
        try (Connection connection = getConnection();
             PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, employeeId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (!rs.next()) {
                    return Optional.empty();
                }
                HrEmployeeDetailDTO dto = mapDetail(rs);
                dto.setJobHistory(loadJobHistory(connection, employeeId));
                return Optional.of(dto);
            }
        } catch (SQLException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    private long executeCount(Connection connection, String sql, List<Object> parameters) throws SQLException {
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            bindParameters(stmt, parameters, 1);
            try (ResultSet rs = stmt.executeQuery()) {
                rs.next();
                return rs.getLong(1);
            }
        }
    }

    private List<HrEmployeeSummaryDTO> executePageQuery(Connection connection,
                                                        String sql,
                                                        List<Object> parameters,
                                                        int page,
                                                        int size) throws SQLException {
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            int nextIndex = bindParameters(stmt, parameters, 1);
            stmt.setInt(nextIndex++, page * size);
            stmt.setInt(nextIndex, size);

            try (ResultSet rs = stmt.executeQuery()) {
                List<HrEmployeeSummaryDTO> employees = new ArrayList<>();
                while (rs.next()) {
                    employees.add(mapSummary(rs));
                }
                return employees;
            }
        }
    }

    private List<HrJobHistoryDTO> loadJobHistory(Connection connection, Integer employeeId) throws SQLException {
        try (PreparedStatement stmt = connection.prepareStatement(JOB_HISTORY_SQL)) {
            stmt.setInt(1, employeeId);
            try (ResultSet rs = stmt.executeQuery()) {
                List<HrJobHistoryDTO> history = new ArrayList<>();
                while (rs.next()) {
                    HrJobHistoryDTO dto = new HrJobHistoryDTO();
                    dto.setStartDate(getLocalDate(rs, "start_date"));
                    dto.setEndDate(getLocalDate(rs, "end_date"));
                    dto.setJobId(rs.getString("job_id"));
                    dto.setJobTitle(rs.getString("job_title"));
                    dto.setDepartmentId(getInteger(rs, "department_id"));
                    dto.setDepartmentName(rs.getString("department_name"));
                    history.add(dto);
                }
                return history;
            }
        }
    }

    private HrEmployeeSummaryDTO mapSummary(ResultSet rs) throws SQLException {
        HrEmployeeSummaryDTO dto = new HrEmployeeSummaryDTO();
        dto.setEmployeeId(getInteger(rs, "employee_id"));
        dto.setFirstName(rs.getString("first_name"));
        dto.setLastName(rs.getString("last_name"));
        dto.setFullName(rs.getString("full_name"));
        dto.setEmail(rs.getString("email"));
        dto.setJobId(rs.getString("job_id"));
        dto.setJobTitle(rs.getString("job_title"));
        dto.setDepartmentId(getInteger(rs, "department_id"));
        dto.setDepartmentName(rs.getString("department_name"));
        dto.setManagerId(getInteger(rs, "manager_id"));
        dto.setManagerName(rs.getString("manager_name"));
        dto.setEmploymentStatus(rs.getString("employment_status"));
        dto.setEmploymentType(rs.getString("employment_type"));
        dto.setSalary(getBigDecimal(rs, "salary"));
        dto.setHireDate(getLocalDate(rs, "hire_date"));
        return dto;
    }

    private HrEmployeeDetailDTO mapDetail(ResultSet rs) throws SQLException {
        HrEmployeeDetailDTO dto = new HrEmployeeDetailDTO();
        dto.setEmployeeId(getInteger(rs, "employee_id"));
        dto.setFirstName(rs.getString("first_name"));
        dto.setLastName(rs.getString("last_name"));
        dto.setFullName(rs.getString("full_name"));
        dto.setEmail(rs.getString("email"));
        dto.setPhoneNumber(rs.getString("phone_number"));
        dto.setHireDate(getLocalDate(rs, "hire_date"));
        dto.setJobId(rs.getString("job_id"));
        dto.setJobTitle(rs.getString("job_title"));
        dto.setSalary(getBigDecimal(rs, "salary"));
        dto.setCommissionPct(getBigDecimal(rs, "commission_pct"));
        dto.setManagerId(getInteger(rs, "manager_id"));
        dto.setManagerName(rs.getString("manager_name"));
        dto.setDepartmentId(getInteger(rs, "department_id"));
        dto.setDepartmentName(rs.getString("department_name"));
        dto.setLocationCity(rs.getString("location_city"));
        dto.setEmploymentStatus(rs.getString("employment_status"));
        dto.setEmploymentType(rs.getString("employment_type"));
        dto.setContractEndDate(getLocalDate(rs, "contract_end_date"));
        dto.setJobHistory(new ArrayList<>());
        return dto;
    }

    private SqlParts buildWhereClause(String search,
                                      Integer departmentId,
                                      String status,
                                      LocalDate hireDateFrom,
                                      LocalDate hireDateTo) {
        StringBuilder where = new StringBuilder("WHERE e.deleted_at IS NULL");
        List<Object> parameters = new ArrayList<>();

        if (search != null && !search.isBlank()) {
            String pattern = "%" + search.trim().toLowerCase() + "%";
            where.append(" AND (")
                    .append("LOWER(TRIM(COALESCE(e.first_name || ' ' || e.last_name, e.first_name, e.last_name))) LIKE ? ")
                    .append("OR LOWER(e.email) LIKE ? ")
                    .append("OR LOWER(j.job_title) LIKE ? ")
                    .append("OR LOWER(d.department_name) LIKE ? ")
                    .append("OR LOWER(TRIM(COALESCE(m.first_name || ' ' || m.last_name, m.first_name, m.last_name))) LIKE ? ")
                    .append("OR LOWER(l.city) LIKE ? ")
                    .append("OR LOWER(l.state_province) LIKE ? ")
                    .append("OR LOWER(c.country_name) LIKE ? ")
                    .append("OR CAST(e.employee_id AS TEXT) LIKE ?")
                    .append(")");
            parameters.add(pattern);
            parameters.add(pattern);
            parameters.add(pattern);
            parameters.add(pattern);
            parameters.add(pattern);
            parameters.add(pattern);
            parameters.add(pattern);
            parameters.add(pattern);
            parameters.add("%" + search.trim() + "%");
        }

        if (departmentId != null) {
            where.append(" AND e.department_id = ?");
            parameters.add(departmentId);
        }

        if (status != null && !status.isBlank()) {
            where.append(" AND e.employment_status = ?");
            parameters.add(status.trim().toUpperCase());
        }

        if (hireDateFrom != null) {
            where.append(" AND e.hire_date >= ?");
            parameters.add(hireDateFrom);
        }

        if (hireDateTo != null) {
            where.append(" AND e.hire_date <= ?");
            parameters.add(hireDateTo);
        }

        return new SqlParts(where.toString(), parameters);
    }

    private String resolveSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return "e.last_name, e.first_name, e.employee_id";
        }
        return SORT_COLUMNS.getOrDefault(sort, "e.last_name, e.first_name, e.employee_id");
    }

    private int bindParameters(PreparedStatement stmt, List<Object> parameters, int startIndex) throws SQLException {
        int index = startIndex;
        for (Object parameter : parameters) {
            if (parameter instanceof Integer value) {
                stmt.setInt(index++, value);
            } else if (parameter instanceof LocalDate value) {
                stmt.setDate(index++, Date.valueOf(value));
            } else {
                stmt.setString(index++, String.valueOf(parameter));
            }
        }
        return index;
    }

    private Integer getInteger(ResultSet rs, String column) throws SQLException {
        int value = rs.getInt(column);
        return rs.wasNull() ? null : value;
    }

    private BigDecimal getBigDecimal(ResultSet rs, String column) throws SQLException {
        BigDecimal value = rs.getBigDecimal(column);
        return rs.wasNull() ? null : value;
    }

    private LocalDate getLocalDate(ResultSet rs, String column) throws SQLException {
        Date value = rs.getDate(column);
        return value == null ? null : value.toLocalDate();
    }

    private record SqlParts(String whereClause, List<Object> parameters) {
    }

    public record EmployeePage(
            List<HrEmployeeSummaryDTO> employees,
            long totalElements,
            int totalPages,
            int currentPage,
            int pageSize
    ) {
    }
}
