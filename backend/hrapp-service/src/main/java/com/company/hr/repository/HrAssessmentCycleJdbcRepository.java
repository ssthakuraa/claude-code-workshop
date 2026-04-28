package com.company.hr.repository;

import com.company.hr.common.exception.HrApplicationException;
import com.company.hr.common.exception.HrConflictException;
import com.company.hr.common.exception.HrResourceNotFoundException;
import com.company.hr.dto.request.HrAssessmentCycleRequest;
import com.company.hr.dto.response.HrAssessmentCycleDTO;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * JDBC-backed repository for assessment-cycle setup management.
 */
public class HrAssessmentCycleJdbcRepository extends HrJdbcRepository {

    private static final List<String> SUPPORTED_LOCALES = List.of("es-MX", "fr-FR", "hi-IN");

    private static final String FIND_ALL_SQL =
            "SELECT cycle.cycle_code, " +
            "       cycle.default_label, " +
            "       COALESCE(cycle_label_locale.translated_value, cycle.default_label) AS localized_label, " +
            "       cycle.period_type, " +
            "       cycle.start_date, " +
            "       cycle.end_date, " +
            "       cycle.cycle_status, " +
            "       cycle.display_order, " +
            "       cycle.is_active " +
            "FROM " + HrTables.ASSESSMENT_CYCLES + " cycle " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " cycle_label_locale ON cycle_label_locale.entity_type = 'ASSESSMENT_CYCLE' " +
            "  AND cycle_label_locale.entity_key = cycle.cycle_code " +
            "  AND cycle_label_locale.field_name = 'label' " +
            "  AND cycle_label_locale.locale_code = ? " +
            "ORDER BY cycle.display_order, cycle.cycle_code";

    private static final String FIND_TRANSLATIONS_SQL =
            "SELECT entity_key, locale_code, translated_value " +
            "FROM " + HrTables.TRANSLATIONS + " " +
            "WHERE entity_type = 'ASSESSMENT_CYCLE' " +
            "  AND field_name = 'label' " +
            "ORDER BY entity_key, locale_code";

    private static final String INSERT_SQL =
            "INSERT INTO " + HrTables.ASSESSMENT_CYCLES + " (" +
            "  cycle_code, default_label, period_type, start_date, end_date, cycle_status, display_order, is_active, created_at, updated_at" +
            ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";

    private static final String UPDATE_SQL =
            "UPDATE " + HrTables.ASSESSMENT_CYCLES + " " +
            "SET default_label = ?, " +
            "    period_type = ?, " +
            "    start_date = ?, " +
            "    end_date = ?, " +
            "    cycle_status = ?, " +
            "    display_order = ?, " +
            "    is_active = ?, " +
            "    updated_at = CURRENT_TIMESTAMP " +
            "WHERE cycle_code = ?";

    private static final String UPSERT_TRANSLATION_SQL =
            "INSERT INTO " + HrTables.TRANSLATIONS + " (" +
            "  entity_type, entity_key, field_name, locale_code, translated_value, created_at" +
            ") VALUES ('ASSESSMENT_CYCLE', ?, 'label', ?, ?, CURRENT_TIMESTAMP) " +
            "ON CONFLICT (entity_type, entity_key, field_name, locale_code) DO UPDATE SET " +
            "  translated_value = EXCLUDED.translated_value";

    private static final String DELETE_TRANSLATION_SQL =
            "DELETE FROM " + HrTables.TRANSLATIONS + " " +
            "WHERE entity_type = 'ASSESSMENT_CYCLE' " +
            "  AND entity_key = ? " +
            "  AND field_name = 'label' " +
            "  AND locale_code = ?";

    public List<HrAssessmentCycleDTO> findAll() {
        try (Connection connection = getConnection()) {
            Map<String, HrAssessmentCycleDTO> cyclesByCode = new LinkedHashMap<>();
            try (PreparedStatement stmt = connection.prepareStatement(FIND_ALL_SQL)) {
                bindCurrentLocale(stmt, 1);
                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        HrAssessmentCycleDTO dto = mapRow(rs);
                        cyclesByCode.put(dto.getCycleCode(), dto);
                    }
                }
            }

            loadTranslations(connection, cyclesByCode);
            return new ArrayList<>(cyclesByCode.values());
        } catch (SQLException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    public HrAssessmentCycleDTO create(HrAssessmentCycleRequest request) {
        String cycleCode = normalizeCycleCode(request.getCycleCode());
        try (Connection connection = getConnection()) {
            connection.setAutoCommit(false);
            try {
                try (PreparedStatement stmt = connection.prepareStatement(INSERT_SQL)) {
                    stmt.setString(1, cycleCode);
                    stmt.setString(2, normalizeLabel(request.getDefaultLabel()));
                    stmt.setString(3, normalizeEnum(request.getPeriodType()));
                    stmt.setDate(4, Date.valueOf(LocalDate.parse(request.getStartDate())));
                    stmt.setDate(5, Date.valueOf(LocalDate.parse(request.getEndDate())));
                    stmt.setString(6, normalizeEnum(request.getCycleStatus()));
                    stmt.setInt(7, request.getDisplayOrder());
                    stmt.setInt(8, Boolean.TRUE.equals(request.getActive()) ? 1 : 0);
                    stmt.executeUpdate();
                }

                upsertTranslations(connection, cycleCode, request.getTranslations());
                connection.commit();
            } catch (SQLException ex) {
                rollbackQuietly(connection);
                throw mapWriteException(ex);
            }
        } catch (SQLException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
        return findByCycleCode(cycleCode);
    }

    public HrAssessmentCycleDTO update(String cycleCode, HrAssessmentCycleRequest request) {
        String normalizedCycleCode = normalizeCycleCode(cycleCode);
        try (Connection connection = getConnection()) {
            connection.setAutoCommit(false);
            try {
                int updated;
                try (PreparedStatement stmt = connection.prepareStatement(UPDATE_SQL)) {
                    stmt.setString(1, normalizeLabel(request.getDefaultLabel()));
                    stmt.setString(2, normalizeEnum(request.getPeriodType()));
                    stmt.setDate(3, Date.valueOf(LocalDate.parse(request.getStartDate())));
                    stmt.setDate(4, Date.valueOf(LocalDate.parse(request.getEndDate())));
                    stmt.setString(5, normalizeEnum(request.getCycleStatus()));
                    stmt.setInt(6, request.getDisplayOrder());
                    stmt.setInt(7, Boolean.TRUE.equals(request.getActive()) ? 1 : 0);
                    stmt.setString(8, normalizedCycleCode);
                    updated = stmt.executeUpdate();
                }

                if (updated == 0) {
                    rollbackQuietly(connection);
                    throw new HrResourceNotFoundException("RESOURCE_NOT_FOUND");
                }

                upsertTranslations(connection, normalizedCycleCode, request.getTranslations());
                connection.commit();
            } catch (SQLException ex) {
                rollbackQuietly(connection);
                throw mapWriteException(ex);
            }
        } catch (SQLException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
        return findByCycleCode(normalizedCycleCode);
    }

    private HrAssessmentCycleDTO findByCycleCode(String cycleCode) {
        return findAll().stream()
                .filter(cycle -> cycleCode.equalsIgnoreCase(cycle.getCycleCode()))
                .findFirst()
                .orElseThrow(() -> new HrResourceNotFoundException("RESOURCE_NOT_FOUND"));
    }

    private void loadTranslations(Connection connection, Map<String, HrAssessmentCycleDTO> cyclesByCode) throws SQLException {
        try (PreparedStatement stmt = connection.prepareStatement(FIND_TRANSLATIONS_SQL);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                String entityKey = rs.getString("entity_key");
                HrAssessmentCycleDTO dto = cyclesByCode.get(entityKey);
                if (dto == null) {
                    continue;
                }

                String localeCode = rs.getString("locale_code");
                if (!SUPPORTED_LOCALES.contains(localeCode)) {
                    continue;
                }

                dto.getTranslations().put(localeCode, rs.getString("translated_value"));
            }
        }
    }

    private HrAssessmentCycleDTO mapRow(ResultSet rs) throws SQLException {
        HrAssessmentCycleDTO dto = new HrAssessmentCycleDTO();
        dto.setCycleCode(rs.getString("cycle_code"));
        dto.setDefaultLabel(rs.getString("default_label"));
        dto.setLocalizedLabel(rs.getString("localized_label"));
        dto.setPeriodType(rs.getString("period_type"));
        Date startDate = rs.getDate("start_date");
        dto.setStartDate(startDate == null ? null : startDate.toLocalDate());
        Date endDate = rs.getDate("end_date");
        dto.setEndDate(endDate == null ? null : endDate.toLocalDate());
        dto.setCycleStatus(rs.getString("cycle_status"));
        int displayOrder = rs.getInt("display_order");
        dto.setDisplayOrder(rs.wasNull() ? null : displayOrder);
        dto.setActive(rs.getInt("is_active") == 1);
        LinkedHashMap<String, String> translations = new LinkedHashMap<>();
        for (String locale : SUPPORTED_LOCALES) {
            translations.put(locale, "");
        }
        dto.setTranslations(translations);
        return dto;
    }

    private void upsertTranslations(Connection connection, String cycleCode, Map<String, String> translations) throws SQLException {
        Map<String, String> safeTranslations = translations == null ? Map.of() : translations;
        for (String locale : SUPPORTED_LOCALES) {
            String value = normalizeTranslation(safeTranslations.get(locale));
            if (value == null) {
                try (PreparedStatement stmt = connection.prepareStatement(DELETE_TRANSLATION_SQL)) {
                    stmt.setString(1, cycleCode);
                    stmt.setString(2, locale);
                    stmt.executeUpdate();
                }
                continue;
            }

            try (PreparedStatement stmt = connection.prepareStatement(UPSERT_TRANSLATION_SQL)) {
                stmt.setString(1, cycleCode);
                stmt.setString(2, locale);
                stmt.setString(3, value);
                stmt.executeUpdate();
            }
        }
    }

    private RuntimeException mapWriteException(SQLException ex) {
        if ("23505".equals(ex.getSQLState())) {
            String message = ex.getMessage() == null ? "" : ex.getMessage().toLowerCase(Locale.ROOT);
            if (message.contains("display")) {
                return new HrConflictException("Display order is already in use.", "CONFLICT");
            }
            return new HrConflictException("Cycle code already exists.", "CONFLICT");
        }
        return new HrApplicationException("DB_ACCESS_ERROR", ex);
    }

    private void rollbackQuietly(Connection connection) {
        try {
            connection.rollback();
        } catch (SQLException ignored) {
            // Best-effort rollback for write flows.
        }
    }

    private String normalizeCycleCode(String cycleCode) {
        return cycleCode == null ? null : cycleCode.trim().toUpperCase(Locale.ROOT);
    }

    private String normalizeLabel(String value) {
        return value == null ? null : value.trim();
    }

    private String normalizeEnum(String value) {
        return value == null ? null : value.trim().toUpperCase(Locale.ROOT);
    }

    private String normalizeTranslation(String value) {
        if (value == null) {
            return null;
        }
        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }
}
