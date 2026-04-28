package com.company.hr.repository;

import com.company.hr.common.exception.HrApplicationException;
import com.company.hr.dto.response.HrCountryDTO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * JDBC-backed country repository for Jersey read endpoints.
 */
public class HrCountryJdbcRepository extends HrJdbcRepository {

    private static final String FIND_ALL_SQL =
            "SELECT " +
            "  c.country_id, " +
            "  COALESCE(c_name_locale.translated_value, c_name_en.translated_value, c.country_name) AS country_name, " +
            "  r.region_id, " +
            "  COALESCE(r_name_locale.translated_value, r_name_en.translated_value, r.region_name) AS region_name, " +
            "  COUNT(e.employee_id) AS employee_count " +
            "FROM " + HrTables.COUNTRIES + " c " +
            "JOIN " + HrTables.REGIONS + " r ON r.region_id = c.region_id " +
            "LEFT JOIN " + HrTables.LOCATIONS + " l ON l.country_id = c.country_id " +
            "LEFT JOIN " + HrTables.DEPARTMENTS + " d ON d.location_id = l.location_id AND d.deleted_at IS NULL " +
            "LEFT JOIN " + HrTables.EMPLOYEES + " e ON e.department_id = d.department_id AND e.deleted_at IS NULL AND e.employment_status <> 'TERMINATED' " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " c_name_locale ON c_name_locale.entity_type = 'COUNTRY' " +
            "  AND c_name_locale.entity_key = c.country_id " +
            "  AND c_name_locale.field_name = 'country_name' " +
            "  AND c_name_locale.locale_code = ? " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " c_name_en ON c_name_en.entity_type = 'COUNTRY' " +
            "  AND c_name_en.entity_key = c.country_id " +
            "  AND c_name_en.field_name = 'country_name' " +
            "  AND c_name_en.locale_code = 'en-US' " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " r_name_locale ON r_name_locale.entity_type = 'REGION' " +
            "  AND r_name_locale.entity_key = CAST(r.region_id AS varchar(60)) " +
            "  AND r_name_locale.field_name = 'region_name' " +
            "  AND r_name_locale.locale_code = ? " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " r_name_en ON r_name_en.entity_type = 'REGION' " +
            "  AND r_name_en.entity_key = CAST(r.region_id AS varchar(60)) " +
            "  AND r_name_en.field_name = 'region_name' " +
            "  AND r_name_en.locale_code = 'en-US' " +
            "GROUP BY c.country_id, c.country_name, c_name_locale.translated_value, c_name_en.translated_value, " +
            "         r.region_id, r.region_name, r_name_locale.translated_value, r_name_en.translated_value " +
            "HAVING COUNT(e.employee_id) > 0 " +
            "ORDER BY employee_count DESC, country_name";

    public List<HrCountryDTO> findAll() {
        try (Connection connection = getConnection();
             PreparedStatement stmt = connection.prepareStatement(FIND_ALL_SQL)) {
            int index = 1;
            index = bindCurrentLocale(stmt, index);
            bindCurrentLocale(stmt, index);
            try (ResultSet rs = stmt.executeQuery()) {
                List<HrCountryDTO> countries = new ArrayList<>();
                while (rs.next()) {
                    countries.add(mapRow(rs));
                }
                return countries;
            }
        } catch (SQLException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    private HrCountryDTO mapRow(ResultSet rs) throws SQLException {
        HrCountryDTO dto = new HrCountryDTO();
        dto.setCountryId(rs.getString("country_id"));
        dto.setCountryName(rs.getString("country_name"));
        dto.setRegionId(getInteger(rs, "region_id"));
        dto.setRegionName(rs.getString("region_name"));
        dto.setEmployeeCount(getInteger(rs, "employee_count"));
        return dto;
    }

    private Integer getInteger(ResultSet rs, String column) throws SQLException {
        int value = rs.getInt(column);
        return rs.wasNull() ? null : value;
    }
}
