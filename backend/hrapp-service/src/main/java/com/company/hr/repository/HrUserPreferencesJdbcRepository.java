package com.company.hr.repository;

import com.company.hr.common.exception.HrApplicationException;
import com.company.hr.common.exception.HrResourceNotFoundException;
import com.company.hr.common.i18n.HrSupportedLocale;
import com.company.hr.dto.request.HrUserPreferencesRequest;
import com.company.hr.dto.response.HrUserPreferencesDTO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

/**
 * JDBC-backed user-preferences repository for the settings page.
 */
public class HrUserPreferencesJdbcRepository extends HrJdbcRepository {

    private static final String FIND_SQL =
            "SELECT p.language_code, p.timezone, p.date_format, p.currency_code " +
            "FROM " + HrTables.USERS + " u " +
            "LEFT JOIN " + HrTables.USER_PREFERENCES + " p ON p.user_id = u.user_id " +
            "WHERE LOWER(u.username) = LOWER(?)";

    private static final String UPSERT_SQL =
            "INSERT INTO " + HrTables.USER_PREFERENCES + " (user_id, language_code, timezone, date_format, currency_code, number_format) " +
            "SELECT u.user_id, ?, ?, ?, ?, ? " +
            "FROM " + HrTables.USERS + " u " +
            "WHERE LOWER(u.username) = LOWER(?) " +
            "ON CONFLICT (user_id) DO UPDATE SET " +
            "  language_code = EXCLUDED.language_code, " +
            "  timezone = EXCLUDED.timezone, " +
            "  date_format = EXCLUDED.date_format, " +
            "  currency_code = EXCLUDED.currency_code, " +
            "  number_format = EXCLUDED.number_format";

    public HrUserPreferencesDTO findForUsername(String username) {
        try (Connection connection = getConnection();
             PreparedStatement stmt = connection.prepareStatement(FIND_SQL)) {
            stmt.setString(1, username);
            try (ResultSet rs = stmt.executeQuery()) {
                if (!rs.next()) {
                    throw new HrResourceNotFoundException("RESOURCE_NOT_FOUND");
                }
                return mapRow(rs);
            }
        } catch (SQLException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    public Optional<String> findLanguageForUsername(String username) {
        try (Connection connection = getConnection();
             PreparedStatement stmt = connection.prepareStatement(FIND_SQL)) {
            stmt.setString(1, username);
            try (ResultSet rs = stmt.executeQuery()) {
                if (!rs.next()) {
                    return Optional.empty();
                }
                String languageCode = rs.getString("language_code");
                if (languageCode == null || languageCode.isBlank()) {
                    return Optional.empty();
                }
                return Optional.of(HrSupportedLocale.normalize(languageCode).code());
            }
        } catch (SQLException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    public HrUserPreferencesDTO upsertForUsername(String username, HrUserPreferencesRequest request) {
        String language = normalizeLanguage(request.getLanguage());
        String timezone = request.getTimezone() == null || request.getTimezone().isBlank() ? "UTC" : request.getTimezone().trim();
        String dateFormat = normalizeDateFormat(request.getDateFormat());
        String currency = request.getCurrency() == null || request.getCurrency().isBlank() ? "USD" : request.getCurrency().trim().toUpperCase();
        String numberFormat = inferNumberFormat(language, currency);

        try (Connection connection = getConnection();
             PreparedStatement stmt = connection.prepareStatement(UPSERT_SQL)) {
            stmt.setString(1, language);
            stmt.setString(2, timezone);
            stmt.setString(3, dateFormat);
            stmt.setString(4, currency);
            stmt.setString(5, numberFormat);
            stmt.setString(6, username);
            stmt.executeUpdate();
        } catch (SQLException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
        return findForUsername(username);
    }

    private HrUserPreferencesDTO mapRow(ResultSet rs) throws SQLException {
        return new HrUserPreferencesDTO(
                normalizeLanguage(rs.getString("language_code")),
                defaultString(rs.getString("timezone"), "UTC"),
                uiDateFormat(rs.getString("date_format")),
                defaultString(rs.getString("currency_code"), "USD")
        );
    }

    private String normalizeLanguage(String language) {
        return HrSupportedLocale.normalize(language).code();
    }

    private String normalizeDateFormat(String uiValue) {
        if (uiValue == null || uiValue.isBlank()) {
            return "MON DD, YYYY";
        }
        return switch (uiValue.trim()) {
            case "short" -> "MM/DD/YYYY";
            case "long" -> "MONTH DD, YYYY";
            default -> "MON DD, YYYY";
        };
    }

    private String uiDateFormat(String dbValue) {
        if (dbValue == null || dbValue.isBlank()) {
            return "medium";
        }
        return switch (dbValue.trim()) {
            case "MM/DD/YYYY", "DD/MM/YYYY", "DD-MM-YYYY", "DD.MM.YYYY", "YYYY-MM-DD" -> "short";
            case "MONTH DD, YYYY" -> "long";
            default -> "medium";
        };
    }

    private String inferNumberFormat(String language, String currency) {
        if ("hi-IN".equals(language) || "INR".equals(currency)) {
            return "1,00,000.00";
        }
        if ("fr-FR".equals(language)) {
            return "1 000,00";
        }
        return switch (currency) {
            case "EUR" -> "1.000,00";
            default -> "1,000.00";
        };
    }

    private String defaultString(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }
}
