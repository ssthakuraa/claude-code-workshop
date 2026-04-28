package com.company.hr.repository;

import com.company.hr.common.exception.HrApplicationException;
import com.company.hr.common.exception.HrConflictException;
import com.company.hr.common.exception.HrResourceNotFoundException;
import com.company.hr.common.exception.HrValidationException;
import com.company.hr.dto.request.HrEmployeeAssessmentRequest;
import com.company.hr.dto.response.HrEmployeeAssessmentAvailableCycleDTO;
import com.company.hr.dto.response.HrEmployeeAssessmentDetailDTO;
import com.company.hr.dto.response.HrEmployeeAssessmentSummaryDTO;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * JDBC repository for employee self-service assessment flows.
 */
public class HrEmployeeAssessmentJdbcRepository extends HrJdbcRepository {

    private static final String SUMMARY_SELECT =
            "SELECT a.assessment_id, " +
            "       a.cycle_code, " +
            "       COALESCE(cycle_label_locale.translated_value, cycle_label_en.translated_value, cycle.default_label) AS cycle_label, " +
            "       a.review_status, " +
            "       TRIM(COALESCE(reviewer.first_name || ' ' || reviewer.last_name, reviewer.first_name, reviewer.last_name)) AS reviewer_name, " +
            "       COALESCE(reviewer_job_title_locale.translated_value, reviewer_job_title_en.translated_value, reviewer_job.job_title) AS reviewer_job_title, " +
            "       a.updated_at, " +
            "       a.submitted_at " +
            "FROM " + HrTables.ASSESSMENTS + " a " +
            "JOIN " + HrTables.ASSESSMENT_CYCLES + " cycle ON cycle.cycle_code = a.cycle_code " +
            "LEFT JOIN " + HrTables.USERS + " reviewer_user ON reviewer_user.user_id = a.reviewer_user_id " +
            "LEFT JOIN " + HrTables.EMPLOYEES + " reviewer ON reviewer.employee_id = reviewer_user.employee_id AND reviewer.deleted_at IS NULL " +
            "LEFT JOIN " + HrTables.JOBS + " reviewer_job ON reviewer_job.job_id = reviewer.job_id " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " cycle_label_locale ON cycle_label_locale.entity_type = 'ASSESSMENT_CYCLE' " +
            "  AND cycle_label_locale.entity_key = cycle.cycle_code " +
            "  AND cycle_label_locale.field_name = 'label' " +
            "  AND cycle_label_locale.locale_code = ? " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " cycle_label_en ON cycle_label_en.entity_type = 'ASSESSMENT_CYCLE' " +
            "  AND cycle_label_en.entity_key = cycle.cycle_code " +
            "  AND cycle_label_en.field_name = 'label' " +
            "  AND cycle_label_en.locale_code = 'en-US' " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " reviewer_job_title_locale ON reviewer_job_title_locale.entity_type = 'JOB' " +
            "  AND reviewer_job_title_locale.entity_key = reviewer_job.job_id " +
            "  AND reviewer_job_title_locale.field_name = 'job_title' " +
            "  AND reviewer_job_title_locale.locale_code = ? " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " reviewer_job_title_en ON reviewer_job_title_en.entity_type = 'JOB' " +
            "  AND reviewer_job_title_en.entity_key = reviewer_job.job_id " +
            "  AND reviewer_job_title_en.field_name = 'job_title' " +
            "  AND reviewer_job_title_en.locale_code = 'en-US' " +
            "WHERE a.employee_id = ? " +
            "ORDER BY cycle.start_date DESC, a.updated_at DESC, a.assessment_id DESC";

    private static final String DETAIL_SELECT =
            "SELECT a.assessment_id, " +
            "       a.cycle_code, " +
            "       COALESCE(cycle_label_locale.translated_value, cycle_label_en.translated_value, cycle.default_label) AS cycle_label, " +
            "       cycle.period_type, " +
            "       cycle.start_date, " +
            "       cycle.end_date, " +
            "       a.review_status, " +
            "       a.goal_completion_pct, " +
            "       a.competency_score, " +
            "       a.employee_reflection, " +
            "       a.next_cycle_plan, " +
            "       a.manager_feedback, " +
            "       a.reviewer_user_id, " +
            "       TRIM(COALESCE(reviewer.first_name || ' ' || reviewer.last_name, reviewer.first_name, reviewer.last_name)) AS reviewer_name, " +
            "       COALESCE(reviewer_job_title_locale.translated_value, reviewer_job_title_en.translated_value, reviewer_job.job_title) AS reviewer_job_title, " +
            "       a.updated_at, " +
            "       a.submitted_at " +
            "FROM " + HrTables.ASSESSMENTS + " a " +
            "JOIN " + HrTables.ASSESSMENT_CYCLES + " cycle ON cycle.cycle_code = a.cycle_code " +
            "LEFT JOIN " + HrTables.USERS + " reviewer_user ON reviewer_user.user_id = a.reviewer_user_id " +
            "LEFT JOIN " + HrTables.EMPLOYEES + " reviewer ON reviewer.employee_id = reviewer_user.employee_id AND reviewer.deleted_at IS NULL " +
            "LEFT JOIN " + HrTables.JOBS + " reviewer_job ON reviewer_job.job_id = reviewer.job_id " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " cycle_label_locale ON cycle_label_locale.entity_type = 'ASSESSMENT_CYCLE' " +
            "  AND cycle_label_locale.entity_key = cycle.cycle_code " +
            "  AND cycle_label_locale.field_name = 'label' " +
            "  AND cycle_label_locale.locale_code = ? " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " cycle_label_en ON cycle_label_en.entity_type = 'ASSESSMENT_CYCLE' " +
            "  AND cycle_label_en.entity_key = cycle.cycle_code " +
            "  AND cycle_label_en.field_name = 'label' " +
            "  AND cycle_label_en.locale_code = 'en-US' " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " reviewer_job_title_locale ON reviewer_job_title_locale.entity_type = 'JOB' " +
            "  AND reviewer_job_title_locale.entity_key = reviewer_job.job_id " +
            "  AND reviewer_job_title_locale.field_name = 'job_title' " +
            "  AND reviewer_job_title_locale.locale_code = ? " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " reviewer_job_title_en ON reviewer_job_title_en.entity_type = 'JOB' " +
            "  AND reviewer_job_title_en.entity_key = reviewer_job.job_id " +
            "  AND reviewer_job_title_en.field_name = 'job_title' " +
            "  AND reviewer_job_title_en.locale_code = 'en-US' " +
            "WHERE a.assessment_id = ? " +
            "  AND a.employee_id = ?";

    private static final String AVAILABLE_CYCLES_SQL =
            "SELECT cycle.cycle_code, " +
            "       COALESCE(cycle_label_locale.translated_value, cycle_label_en.translated_value, cycle.default_label) AS cycle_label, " +
            "       cycle.period_type, " +
            "       cycle.start_date, " +
            "       cycle.end_date " +
            "FROM " + HrTables.ASSESSMENT_CYCLES + " cycle " +
            "LEFT JOIN " + HrTables.ASSESSMENTS + " a ON a.cycle_code = cycle.cycle_code AND a.employee_id = ? " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " cycle_label_locale ON cycle_label_locale.entity_type = 'ASSESSMENT_CYCLE' " +
            "  AND cycle_label_locale.entity_key = cycle.cycle_code " +
            "  AND cycle_label_locale.field_name = 'label' " +
            "  AND cycle_label_locale.locale_code = ? " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " cycle_label_en ON cycle_label_en.entity_type = 'ASSESSMENT_CYCLE' " +
            "  AND cycle_label_en.entity_key = cycle.cycle_code " +
            "  AND cycle_label_en.field_name = 'label' " +
            "  AND cycle_label_en.locale_code = 'en-US' " +
            "WHERE cycle.is_active = 1 " +
            "  AND cycle.cycle_status = 'OPEN' " +
            "  AND a.assessment_id IS NULL " +
            "ORDER BY cycle.display_order, cycle.cycle_code";

    private static final String INSERT_SQL =
            "INSERT INTO " + HrTables.ASSESSMENTS + " (" +
            "  employee_id, cycle_code, review_status, goal_completion_pct, competency_score, manager_feedback, employee_reflection, next_cycle_plan, reviewer_user_id, submitted_at, created_at, updated_at" +
            ") " +
            "SELECT e.employee_id, ?, 'DRAFT', ?, ?, NULL, ?, ?, COALESCE(manager_user.user_id, fallback_user.user_id), NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP " +
            "FROM " + HrTables.EMPLOYEES + " e " +
            "LEFT JOIN " + HrTables.USERS + " manager_user ON manager_user.employee_id = e.manager_id AND manager_user.is_active = 1 " +
            "CROSS JOIN LATERAL (" +
            "  SELECT u.user_id " +
            "  FROM " + HrTables.USERS + " u " +
            "  JOIN " + HrTables.USER_ROLES + " ur ON ur.user_id = u.user_id " +
            "  JOIN " + HrTables.ROLES + " r ON r.role_id = ur.role_id " +
            "  WHERE u.is_active = 1 " +
            "    AND r.role_name IN ('ROLE_ADMIN', 'ROLE_HR_SPECIALIST') " +
            "  ORDER BY CASE WHEN r.role_name = 'ROLE_HR_SPECIALIST' THEN 0 ELSE 1 END, u.user_id " +
            "  FETCH FIRST 1 ROW ONLY" +
            ") fallback_user " +
            "WHERE e.employee_id = ? " +
            "  AND e.deleted_at IS NULL";

    private static final String UPDATE_DRAFT_SQL =
            "UPDATE " + HrTables.ASSESSMENTS + " " +
            "SET goal_completion_pct = ?, " +
            "    competency_score = ?, " +
            "    employee_reflection = ?, " +
            "    next_cycle_plan = ?, " +
            "    updated_at = CURRENT_TIMESTAMP " +
            "WHERE assessment_id = ? " +
            "  AND employee_id = ? " +
            "  AND review_status = 'DRAFT'";

    private static final String SUBMIT_DRAFT_SQL =
            "UPDATE " + HrTables.ASSESSMENTS + " " +
            "SET goal_completion_pct = ?, " +
            "    competency_score = ?, " +
            "    employee_reflection = ?, " +
            "    next_cycle_plan = ?, " +
            "    review_status = 'SUBMITTED', " +
            "    submitted_at = CURRENT_TIMESTAMP, " +
            "    updated_at = CURRENT_TIMESTAMP " +
            "WHERE assessment_id = ? " +
            "  AND employee_id = ? " +
            "  AND review_status = 'DRAFT'";

    private static final String OWNERSHIP_CHECK_SQL =
            "SELECT review_status " +
            "FROM " + HrTables.ASSESSMENTS + " " +
            "WHERE assessment_id = ? " +
            "  AND employee_id = ?";

    public List<HrEmployeeAssessmentSummaryDTO> findMine(int employeeId) {
        try (Connection connection = getConnection();
             PreparedStatement stmt = connection.prepareStatement(SUMMARY_SELECT)) {
            int index = 1;
            index = bindCurrentLocale(stmt, index);
            index = bindCurrentLocale(stmt, index);
            stmt.setInt(index, employeeId);
            try (ResultSet rs = stmt.executeQuery()) {
                List<HrEmployeeAssessmentSummaryDTO> rows = new ArrayList<>();
                while (rs.next()) {
                    rows.add(mapSummary(rs));
                }
                return rows;
            }
        } catch (SQLException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    public HrEmployeeAssessmentDetailDTO findMineById(long assessmentId, int employeeId) {
        try (Connection connection = getConnection();
             PreparedStatement stmt = connection.prepareStatement(DETAIL_SELECT)) {
            int index = 1;
            index = bindCurrentLocale(stmt, index);
            index = bindCurrentLocale(stmt, index);
            stmt.setLong(index++, assessmentId);
            stmt.setInt(index, employeeId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (!rs.next()) {
                    throw new HrResourceNotFoundException("RESOURCE_NOT_FOUND");
                }
                return mapDetail(rs);
            }
        } catch (SQLException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    public List<HrEmployeeAssessmentAvailableCycleDTO> findAvailableCycles(int employeeId) {
        try (Connection connection = getConnection();
             PreparedStatement stmt = connection.prepareStatement(AVAILABLE_CYCLES_SQL)) {
            stmt.setInt(1, employeeId);
            bindCurrentLocale(stmt, 2);
            try (ResultSet rs = stmt.executeQuery()) {
                List<HrEmployeeAssessmentAvailableCycleDTO> rows = new ArrayList<>();
                while (rs.next()) {
                    HrEmployeeAssessmentAvailableCycleDTO dto = new HrEmployeeAssessmentAvailableCycleDTO();
                    dto.setCycleCode(rs.getString("cycle_code"));
                    dto.setCycleLabel(rs.getString("cycle_label"));
                    dto.setPeriodType(rs.getString("period_type"));
                    Date startDate = rs.getDate("start_date");
                    dto.setStartDate(startDate == null ? null : startDate.toLocalDate());
                    Date endDate = rs.getDate("end_date");
                    dto.setEndDate(endDate == null ? null : endDate.toLocalDate());
                    rows.add(dto);
                }
                return rows;
            }
        } catch (SQLException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    public HrEmployeeAssessmentDetailDTO createDraft(int employeeId, HrEmployeeAssessmentRequest request) {
        String normalizedCycleCode = normalizeCycleCode(request.getCycleCode());
        try (Connection connection = getConnection()) {
            connection.setAutoCommit(false);
            try {
                long assessmentId;
                try (PreparedStatement stmt = connection.prepareStatement(INSERT_SQL, Statement.RETURN_GENERATED_KEYS)) {
                    stmt.setString(1, normalizedCycleCode);
                    bindDraftValues(stmt, request, 2);
                    stmt.setInt(6, employeeId);
                    int inserted = stmt.executeUpdate();
                    if (inserted == 0) {
                        rollbackQuietly(connection);
                        throw new HrResourceNotFoundException("RESOURCE_NOT_FOUND");
                    }
                    assessmentId = extractGeneratedId(stmt);
                }
                connection.commit();
                return findMineById(assessmentId, employeeId);
            } catch (SQLException ex) {
                rollbackQuietly(connection);
                throw mapWriteException(ex);
            }
        } catch (SQLException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    public HrEmployeeAssessmentDetailDTO updateDraft(long assessmentId, int employeeId, HrEmployeeAssessmentRequest request) {
        updateOwnedDraft(UPDATE_DRAFT_SQL, assessmentId, employeeId, request);
        return findMineById(assessmentId, employeeId);
    }

    public HrEmployeeAssessmentDetailDTO submitDraft(long assessmentId, int employeeId, HrEmployeeAssessmentRequest request) {
        updateOwnedDraft(SUBMIT_DRAFT_SQL, assessmentId, employeeId, request);
        return findMineById(assessmentId, employeeId);
    }

    private void updateOwnedDraft(String sql, long assessmentId, int employeeId, HrEmployeeAssessmentRequest request) {
        try (Connection connection = getConnection()) {
            connection.setAutoCommit(false);
            try {
                int updated;
                try (PreparedStatement stmt = connection.prepareStatement(sql)) {
                    bindDraftValues(stmt, request, 1);
                    stmt.setLong(5, assessmentId);
                    stmt.setInt(6, employeeId);
                    updated = stmt.executeUpdate();
                }
                if (updated == 0) {
                    rollbackQuietly(connection);
                    validateEditableOwnership(connection, assessmentId, employeeId);
                }
                connection.commit();
            } catch (SQLException ex) {
                rollbackQuietly(connection);
                throw new HrApplicationException("DB_ACCESS_ERROR", ex);
            }
        } catch (SQLException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    private void validateEditableOwnership(Connection connection, long assessmentId, int employeeId) throws SQLException {
        try (PreparedStatement stmt = connection.prepareStatement(OWNERSHIP_CHECK_SQL)) {
            stmt.setLong(1, assessmentId);
            stmt.setInt(2, employeeId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (!rs.next()) {
                    throw new HrResourceNotFoundException("RESOURCE_NOT_FOUND");
                }
                Map<String, String> fieldErrors = new LinkedHashMap<>();
                fieldErrors.put("reviewStatus", "VALIDATION_READ_ONLY_STATUS");
                throw new HrValidationException(fieldErrors);
            }
        }
    }

    private int bindDraftValues(PreparedStatement stmt, HrEmployeeAssessmentRequest request, int startIndex) throws SQLException {
        int index = startIndex;
        if (request.getGoalCompletionPct() == null) {
            stmt.setNull(index++, java.sql.Types.NUMERIC);
        } else {
            stmt.setBigDecimal(index++, request.getGoalCompletionPct());
        }
        if (request.getCompetencyScore() == null) {
            stmt.setNull(index++, java.sql.Types.NUMERIC);
        } else {
            stmt.setBigDecimal(index++, request.getCompetencyScore());
        }
        stmt.setString(index++, normalizeText(request.getEmployeeReflection()));
        stmt.setString(index++, normalizeText(request.getNextCyclePlan()));
        return index;
    }

    private long extractGeneratedId(PreparedStatement stmt) throws SQLException {
        try (ResultSet keys = stmt.getGeneratedKeys()) {
            if (!keys.next()) {
                throw new HrApplicationException("DB_ACCESS_ERROR");
            }
            return keys.getLong(1);
        }
    }

    private HrEmployeeAssessmentSummaryDTO mapSummary(ResultSet rs) throws SQLException {
        HrEmployeeAssessmentSummaryDTO dto = new HrEmployeeAssessmentSummaryDTO();
        dto.setAssessmentId(getLong(rs, "assessment_id"));
        dto.setCycleCode(rs.getString("cycle_code"));
        dto.setCycleLabel(rs.getString("cycle_label"));
        dto.setReviewStatus(rs.getString("review_status"));
        dto.setReviewerName(rs.getString("reviewer_name"));
        dto.setReviewerJobTitle(rs.getString("reviewer_job_title"));
        dto.setUpdatedAt(getLocalDateTime(rs, "updated_at"));
        dto.setSubmittedAt(getLocalDateTime(rs, "submitted_at"));
        return dto;
    }

    private HrEmployeeAssessmentDetailDTO mapDetail(ResultSet rs) throws SQLException {
        HrEmployeeAssessmentDetailDTO dto = new HrEmployeeAssessmentDetailDTO();
        dto.setAssessmentId(getLong(rs, "assessment_id"));
        dto.setCycleCode(rs.getString("cycle_code"));
        dto.setCycleLabel(rs.getString("cycle_label"));
        dto.setPeriodType(rs.getString("period_type"));
        Date startDate = rs.getDate("start_date");
        dto.setCycleStartDate(startDate == null ? null : startDate.toLocalDate());
        Date endDate = rs.getDate("end_date");
        dto.setCycleEndDate(endDate == null ? null : endDate.toLocalDate());
        dto.setReviewStatus(rs.getString("review_status"));
        dto.setGoalCompletionPct(rs.getBigDecimal("goal_completion_pct"));
        dto.setCompetencyScore(rs.getBigDecimal("competency_score"));
        dto.setEmployeeReflection(rs.getString("employee_reflection"));
        dto.setNextCyclePlan(rs.getString("next_cycle_plan"));
        dto.setManagerFeedback(rs.getString("manager_feedback"));
        int reviewerUserId = rs.getInt("reviewer_user_id");
        dto.setReviewerUserId(rs.wasNull() ? null : reviewerUserId);
        dto.setReviewerName(rs.getString("reviewer_name"));
        dto.setReviewerJobTitle(rs.getString("reviewer_job_title"));
        dto.setUpdatedAt(getLocalDateTime(rs, "updated_at"));
        dto.setSubmittedAt(getLocalDateTime(rs, "submitted_at"));
        return dto;
    }

    private RuntimeException mapWriteException(SQLException ex) {
        if ("23505".equals(ex.getSQLState())) {
            return new HrConflictException("Assessment already exists for this cycle.", "CONFLICT");
        }
        return new HrApplicationException("DB_ACCESS_ERROR", ex);
    }

    private void rollbackQuietly(Connection connection) {
        try {
            connection.rollback();
        } catch (SQLException ignored) {
            // Best-effort rollback for assessment write flows.
        }
    }

    private String normalizeCycleCode(String cycleCode) {
        return cycleCode == null ? null : cycleCode.trim().toUpperCase(Locale.ROOT);
    }

    private String normalizeText(String value) {
        if (value == null) {
            return null;
        }
        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }

    private Long getLong(ResultSet rs, String column) throws SQLException {
        long value = rs.getLong(column);
        return rs.wasNull() ? null : value;
    }

    private LocalDateTime getLocalDateTime(ResultSet rs, String column) throws SQLException {
        Timestamp value = rs.getTimestamp(column);
        return rs.wasNull() || value == null ? null : value.toLocalDateTime();
    }
}
