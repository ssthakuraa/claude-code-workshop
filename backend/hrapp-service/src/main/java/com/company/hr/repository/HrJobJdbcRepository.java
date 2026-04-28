package com.company.hr.repository;

import com.company.hr.common.exception.HrApplicationException;
import com.company.hr.dto.response.HrJobDTO;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Explicit JDBC-backed job repository for read endpoints.
 */
public class HrJobJdbcRepository extends HrJdbcRepository {

    private static final String FIND_ALL_SQL =
            "SELECT job.job_id, " +
            "       COALESCE(job_title_locale.translated_value, job_title_en.translated_value, job.job_title) AS job_title, " +
            "       job.min_salary, " +
            "       job.max_salary " +
            "FROM " + HrTables.JOBS + " job " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " job_title_locale ON job_title_locale.entity_type = 'JOB' " +
            "  AND job_title_locale.entity_key = job.job_id " +
            "  AND job_title_locale.field_name = 'job_title' " +
            "  AND job_title_locale.locale_code = ? " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " job_title_en ON job_title_en.entity_type = 'JOB' " +
            "  AND job_title_en.entity_key = job.job_id " +
            "  AND job_title_en.field_name = 'job_title' " +
            "  AND job_title_en.locale_code = 'en-US' " +
            "ORDER BY job_title";

    private static final String FIND_BY_ID_SQL =
            "SELECT job.job_id, " +
            "       COALESCE(job_title_locale.translated_value, job_title_en.translated_value, job.job_title) AS job_title, " +
            "       job.min_salary, " +
            "       job.max_salary " +
            "FROM " + HrTables.JOBS + " job " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " job_title_locale ON job_title_locale.entity_type = 'JOB' " +
            "  AND job_title_locale.entity_key = job.job_id " +
            "  AND job_title_locale.field_name = 'job_title' " +
            "  AND job_title_locale.locale_code = ? " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " job_title_en ON job_title_en.entity_type = 'JOB' " +
            "  AND job_title_en.entity_key = job.job_id " +
            "  AND job_title_en.field_name = 'job_title' " +
            "  AND job_title_en.locale_code = 'en-US' " +
            "WHERE job.job_id = ?";

    public List<HrJobDTO> findAll() {
        try (Connection connection = getConnection();
             PreparedStatement stmt = connection.prepareStatement(FIND_ALL_SQL)) {
            bindCurrentLocale(stmt, 1);
            try (ResultSet rs = stmt.executeQuery()) {
                List<HrJobDTO> jobs = new ArrayList<>();
                while (rs.next()) {
                    jobs.add(mapRow(rs));
                }
                return jobs;
            }
        } catch (SQLException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    public Optional<HrJobDTO> findById(String jobId) {
        if (jobId == null) {
            return Optional.empty();
        }
        try (Connection connection = getConnection();
             PreparedStatement stmt = connection.prepareStatement(FIND_BY_ID_SQL)) {
            int index = bindCurrentLocale(stmt, 1);
            stmt.setString(index, jobId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapRow(rs));
                }
                return Optional.empty();
            }
        } catch (SQLException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    private HrJobDTO mapRow(ResultSet rs) throws SQLException {
        HrJobDTO dto = new HrJobDTO();
        dto.setJobId(rs.getString("job_id"));
        dto.setJobTitle(rs.getString("job_title"));
        dto.setMinSalary(getBigDecimal(rs, "min_salary"));
        dto.setMaxSalary(getBigDecimal(rs, "max_salary"));
        return dto;
    }

    private BigDecimal getBigDecimal(ResultSet rs, String column) throws SQLException {
        BigDecimal value = rs.getBigDecimal(column);
        return rs.wasNull() ? null : value;
    }
}
