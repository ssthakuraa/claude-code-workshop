package com.company.hr.repository;

import com.company.hr.common.exception.HrBusinessRuleViolationException;
import com.company.hr.common.exception.HrConflictException;
import com.company.hr.common.exception.HrResourceNotFoundException;
import com.company.hr.dto.request.HrEmployeeCreateRequest;
import com.company.hr.dto.request.HrPromoteRequest;
import com.company.hr.dto.request.HrTerminateRequest;
import com.company.hr.dto.request.HrTransferRequest;
import com.company.hr.security.HrPasswordHasher;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Optional;

/**
 * Explicit JDBC-backed employee command repository for the Jersey-era mutations.
 */
public class HrEmployeeCommandJdbcRepository extends HrJdbcRepository {

    private static final String FIND_EMPLOYEE_SQL =
            "SELECT employee_id, hire_date, job_id, department_id, manager_id, salary, employment_status " +
            "FROM " + HrTables.EMPLOYEES + " " +
            "WHERE deleted_at IS NULL AND employee_id = ?";

    public Integer hireEmployee(HrEmployeeCreateRequest request) {
        try (Connection connection = getConnection()) {
            connection.setAutoCommit(false);
            try {
                Integer employeeId = insertEmployee(connection, request);
                connection.commit();
                return employeeId;
            } catch (Exception ex) {
                rollbackQuietly(connection, ex);
                throw ex;
            }
        } catch (SQLException ex) {
            throw new IllegalStateException("DB_ACCESS_ERROR", ex);
        }
    }

    public Integer terminateEmployee(HrTerminateRequest request) {
        try (Connection connection = getConnection()) {
            connection.setAutoCommit(false);
            try {
                checkIdempotency(connection, request.getIdempotencyKey(), "POST /employees/terminate");
                EmployeeState employee = loadEmployeeState(connection, request.getEmployeeId());

                if ("TERMINATED".equals(employee.employmentStatus())) {
                    throw new HrBusinessRuleViolationException("EMPLOYEE_ALREADY_TERMINATED");
                }

                LocalDate effectiveDate = request.getEffectiveDate() != null ? request.getEffectiveDate() : LocalDate.now();
                insertCurrentAssignmentHistory(connection, employee, effectiveDate);
                updateTermination(connection, employee.employeeId());
                deactivateUser(connection, employee.employeeId());
                recordIdempotency(connection, request.getIdempotencyKey(), "POST /employees/terminate", 200);
                connection.commit();
                return employee.employeeId();
            } catch (Exception ex) {
                rollbackQuietly(connection, ex);
                throw ex;
            }
        } catch (HrConflictException | HrBusinessRuleViolationException | HrResourceNotFoundException ex) {
            throw ex;
        } catch (SQLException ex) {
            throw new IllegalStateException("DB_ACCESS_ERROR", ex);
        }
    }

    public Integer promoteEmployee(HrPromoteRequest request) {
        throw new IllegalStateException("LAB_STARTER_PROMOTE_FLOW_INCOMPLETE");
    }

    public Integer transferEmployee(HrTransferRequest request) {
        try (Connection connection = getConnection()) {
            connection.setAutoCommit(false);
            try {
                checkIdempotency(connection, request.getIdempotencyKey(), "POST /employees/transfer");
                EmployeeState employee = loadEmployeeState(connection, request.getEmployeeId());
                requireDepartment(connection, request.getNewDepartmentId());
                if (request.getNewManagerId() != null) {
                    requireEmployee(connection, request.getNewManagerId());
                }

                LocalDate effectiveDate = request.getEffectiveDate() != null ? request.getEffectiveDate() : LocalDate.now();
                insertCurrentAssignmentHistory(connection, employee, effectiveDate.minusDays(1));
                updateTransfer(connection, employee.employeeId(), request.getNewDepartmentId(), request.getNewManagerId());
                recordIdempotency(connection, request.getIdempotencyKey(), "POST /employees/transfer", 200);
                connection.commit();
                return employee.employeeId();
            } catch (Exception ex) {
                rollbackQuietly(connection, ex);
                throw ex;
            }
        } catch (HrConflictException | HrBusinessRuleViolationException | HrResourceNotFoundException ex) {
            throw ex;
        } catch (SQLException ex) {
            throw new IllegalStateException("DB_ACCESS_ERROR", ex);
        }
    }

    private Integer insertEmployee(Connection connection, HrEmployeeCreateRequest request) throws SQLException {
        String sql =
                "INSERT INTO " + HrTables.EMPLOYEES + " (" +
                "first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id, employment_status, employment_type, contract_end_date" +
                ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (PreparedStatement stmt = connection.prepareStatement(sql, new String[] {"employee_id"})) {
            stmt.setString(1, request.getFirstName());
            stmt.setString(2, request.getLastName());
            stmt.setString(3, request.getEmail());
            stmt.setString(4, request.getPhoneNumber());
            stmt.setDate(5, Date.valueOf(request.getHireDate()));
            stmt.setString(6, request.getJobId());
            setBigDecimal(stmt, 7, request.getSalary());
            setBigDecimal(stmt, 8, request.getCommissionPct());
            setInteger(stmt, 9, request.getManagerId());
            setInteger(stmt, 10, request.getDepartmentId());
            stmt.setString(11, request.getEmploymentStatus().name());
            stmt.setString(12, request.getEmploymentType().name());
            setLocalDate(stmt, 13, request.getContractEndDate());
            stmt.executeUpdate();

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    return generatedKeys.getInt(1);
                }
            }
        }

        throw new IllegalStateException("DB_ACCESS_ERROR");
    }

    private Integer insertUser(Connection connection, Integer employeeId, String username, String rawPassword) throws SQLException {
        String sql = "INSERT INTO " + HrTables.USERS + " (employee_id, username, password_hash, is_active) VALUES (?, ?, ?, 1)";

        try (PreparedStatement stmt = connection.prepareStatement(sql, new String[] {"user_id"})) {
            stmt.setInt(1, employeeId);
            stmt.setString(2, username);
            stmt.setString(3, bcrypt(rawPassword));
            stmt.executeUpdate();

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    return generatedKeys.getInt(1);
                }
            }
        }

        throw new IllegalStateException("DB_ACCESS_ERROR");
    }

    private void insertUserRole(Connection connection, Integer userId, Integer roleId) throws SQLException {
        String sql = "INSERT INTO " + HrTables.USER_ROLES + " (user_id, role_id) VALUES (?, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            stmt.setInt(2, roleId);
            stmt.executeUpdate();
        }
    }

    private void insertCurrentAssignmentHistory(Connection connection, EmployeeState employee, LocalDate requestedEndDate) throws SQLException {
        LocalDate historyStart = currentAssignmentStart(connection, employee);
        LocalDate historyEnd = normalizeHistoryEndDate(historyStart, requestedEndDate);
        String sql = "INSERT INTO " + HrTables.JOB_HISTORY + " (employee_id, start_date, end_date, job_id, department_id) VALUES (?, ?, ?, ?, ?)";

        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, employee.employeeId());
            stmt.setDate(2, Date.valueOf(historyStart));
            stmt.setDate(3, Date.valueOf(historyEnd));
            stmt.setString(4, employee.jobId());
            setInteger(stmt, 5, employee.departmentId());
            stmt.executeUpdate();
        }
    }

    private LocalDate currentAssignmentStart(Connection connection, EmployeeState employee) throws SQLException {
        String sql = "SELECT MAX(end_date) AS max_end_date FROM " + HrTables.JOB_HISTORY + " WHERE employee_id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, employee.employeeId());
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Date maxEndDate = rs.getDate("max_end_date");
                    if (maxEndDate != null) {
                        return maxEndDate.toLocalDate().plusDays(1);
                    }
                }
            }
        }
        return employee.hireDate();
    }

    private LocalDate normalizeHistoryEndDate(LocalDate startDate, LocalDate requestedEndDate) {
        if (requestedEndDate == null || !requestedEndDate.isAfter(startDate)) {
            return startDate.plusDays(1);
        }
        return requestedEndDate;
    }

    private void updateTermination(Connection connection, Integer employeeId) throws SQLException {
        String sql = "UPDATE " + HrTables.EMPLOYEES + " SET employment_status = 'TERMINATED', deleted_at = ? WHERE employee_id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setTimestamp(1, Timestamp.from(Instant.now()));
            stmt.setInt(2, employeeId);
            stmt.executeUpdate();
        }
    }

    private void deactivateUser(Connection connection, Integer employeeId) throws SQLException {
        String sql = "UPDATE " + HrTables.USERS + " SET is_active = 0 WHERE employee_id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, employeeId);
            stmt.executeUpdate();
        }
    }

    private void updatePromotion(Connection connection, Integer employeeId, String newJobId, BigDecimal newSalary) throws SQLException {
        String sql = newSalary == null
                ? "UPDATE " + HrTables.EMPLOYEES + " SET job_id = ? WHERE employee_id = ?"
                : "UPDATE " + HrTables.EMPLOYEES + " SET job_id = ?, salary = ? WHERE employee_id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, newJobId);
            if (newSalary == null) {
                stmt.setInt(2, employeeId);
            } else {
                stmt.setBigDecimal(2, newSalary);
                stmt.setInt(3, employeeId);
            }
            stmt.executeUpdate();
        }
    }

    private void updateTransfer(Connection connection, Integer employeeId, Integer newDepartmentId, Integer newManagerId) throws SQLException {
        String sql = "UPDATE " + HrTables.EMPLOYEES + " SET department_id = ?, manager_id = ? WHERE employee_id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, newDepartmentId);
            setInteger(stmt, 2, newManagerId);
            stmt.setInt(3, employeeId);
            stmt.executeUpdate();
        }
    }

    private EmployeeState loadEmployeeState(Connection connection, Integer employeeId) throws SQLException {
        try (PreparedStatement stmt = connection.prepareStatement(FIND_EMPLOYEE_SQL)) {
            stmt.setInt(1, employeeId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (!rs.next()) {
                    throw new HrResourceNotFoundException("Employee", employeeId);
                }
                return new EmployeeState(
                        rs.getInt("employee_id"),
                        rs.getDate("hire_date").toLocalDate(),
                        rs.getString("job_id"),
                        getInteger(rs, "department_id"),
                        getInteger(rs, "manager_id"),
                        rs.getBigDecimal("salary"),
                        rs.getString("employment_status")
                );
            }
        }
    }

    private void requireEmployee(Connection connection, Integer employeeId) throws SQLException {
        loadEmployeeState(connection, employeeId);
    }

    private void requireDepartment(Connection connection, Integer departmentId) throws SQLException {
        String sql = "SELECT department_id FROM " + HrTables.DEPARTMENTS + " WHERE deleted_at IS NULL AND department_id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, departmentId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (!rs.next()) {
                    throw new HrResourceNotFoundException("Department", departmentId);
                }
            }
        }
    }

    private JobInfo loadJob(Connection connection, String jobId) throws SQLException {
        String sql = "SELECT job_id, min_salary, max_salary FROM " + HrTables.JOBS + " WHERE job_id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, jobId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (!rs.next()) {
                    throw new HrResourceNotFoundException("Job", jobId);
                }
                return new JobInfo(
                        rs.getString("job_id"),
                        rs.getBigDecimal("min_salary"),
                        rs.getBigDecimal("max_salary")
                );
            }
        }
    }

    private void validateSalaryForJob(BigDecimal salary, JobInfo job) {
        if (salary == null || job == null) {
            return;
        }
        if (job.minSalary() != null && salary.compareTo(job.minSalary()) < 0) {
            throw new HrBusinessRuleViolationException("SALARY_BELOW_MINIMUM");
        }
        if (job.maxSalary() != null && salary.compareTo(job.maxSalary()) > 0) {
            throw new HrBusinessRuleViolationException("SALARY_ABOVE_MAXIMUM");
        }
    }

    private boolean emailExists(Connection connection, String email) throws SQLException {
        String sql = "SELECT 1 FROM " + HrTables.EMPLOYEES + " WHERE LOWER(email) = LOWER(?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, email);
            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next();
            }
        }
    }

    private String resolveUsername(Connection connection, HrEmployeeCreateRequest request, Integer employeeId) throws SQLException {
        String base = request.getUsername() != null && !request.getUsername().isBlank()
                ? request.getUsername().trim()
                : request.getEmail().split("@")[0];
        String candidate = base;
        while (usernameExists(connection, candidate)) {
            candidate = base + "_" + employeeId;
            if (!usernameExists(connection, candidate)) {
                return candidate;
            }
            base = candidate;
        }
        return candidate;
    }

    private boolean usernameExists(Connection connection, String username) throws SQLException {
        String sql = "SELECT 1 FROM " + HrTables.USERS + " WHERE LOWER(username) = LOWER(?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, username);
            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next();
            }
        }
    }

    private Integer loadRoleId(Connection connection, String roleName) throws SQLException {
        String sql = "SELECT role_id FROM " + HrTables.ROLES + " WHERE role_name = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, roleName);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("role_id");
                }
            }
        }
        throw new HrResourceNotFoundException("Role", roleName);
    }

    private void checkIdempotency(Connection connection, String key, String endpoint) throws SQLException {
        String sql = "SELECT 1 FROM " + HrTables.IDEMPOTENCY_KEYS + " WHERE idempotency_key = ? AND endpoint = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, key);
            stmt.setString(2, endpoint);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    throw new HrConflictException("DUPLICATE_REQUEST");
                }
            }
        }
    }

    private void recordIdempotency(Connection connection, String key, String endpoint, int status) throws SQLException {
        String sql = "INSERT INTO " + HrTables.IDEMPOTENCY_KEYS + " (idempotency_key, endpoint, response_status, response_body, expires_at) VALUES (?, ?, ?, NULL, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, key);
            stmt.setString(2, endpoint);
            stmt.setInt(3, status);
            stmt.setTimestamp(4, Timestamp.from(Instant.now().plusSeconds(86_400)));
            stmt.executeUpdate();
        }
    }

    private void rollbackQuietly(Connection connection, Exception original) {
        try {
            connection.rollback();
        } catch (SQLException rollbackEx) {
            original.addSuppressed(rollbackEx);
        }
    }

    private String bcrypt(String rawPassword) {
        return HrPasswordHasher.hash(rawPassword);
    }

    private Integer getInteger(ResultSet rs, String column) throws SQLException {
        int value = rs.getInt(column);
        return rs.wasNull() ? null : value;
    }

    private void setInteger(PreparedStatement stmt, int index, Integer value) throws SQLException {
        if (value == null) {
            stmt.setNull(index, java.sql.Types.INTEGER);
        } else {
            stmt.setInt(index, value);
        }
    }

    private void setBigDecimal(PreparedStatement stmt, int index, BigDecimal value) throws SQLException {
        if (value == null) {
            stmt.setNull(index, java.sql.Types.NUMERIC);
        } else {
            stmt.setBigDecimal(index, value);
        }
    }

    private void setLocalDate(PreparedStatement stmt, int index, LocalDate value) throws SQLException {
        if (value == null) {
            stmt.setNull(index, java.sql.Types.DATE);
        } else {
            stmt.setDate(index, Date.valueOf(value));
        }
    }

    private record JobInfo(String jobId, BigDecimal minSalary, BigDecimal maxSalary) {
    }

    private record EmployeeState(
            Integer employeeId,
            LocalDate hireDate,
            String jobId,
            Integer departmentId,
            Integer managerId,
            BigDecimal salary,
            String employmentStatus
    ) {
    }
}
