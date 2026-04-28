package com.company.hr.repository;

import com.company.hr.common.exception.HrApplicationException;
import com.company.hr.dto.response.HrLocationDTO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * JDBC-backed location repository for Jersey read endpoints.
 */
public class HrLocationJdbcRepository extends HrJdbcRepository {

    private static final String FIND_ALL_SQL =
            "SELECT " +
            "  l.location_id, " +
            "  l.street_address, " +
            "  l.postal_code, " +
            "  COALESCE(l_city_locale.translated_value, l_city_en.translated_value, l.city) AS city, " +
            "  COALESCE(l_state_locale.translated_value, l_state_en.translated_value, l.state_province) AS state_province, " +
            "  c.country_id, " +
            "  COALESCE(c_name_locale.translated_value, c_name_en.translated_value, c.country_name) AS country_name, " +
            "  (" +
            "    SELECT COUNT(*) " +
            "    FROM " + HrTables.DEPARTMENTS + " d " +
            "    JOIN " + HrTables.EMPLOYEES + " e ON e.department_id = d.department_id " +
            "    WHERE d.location_id = l.location_id " +
            "      AND d.deleted_at IS NULL " +
            "      AND e.deleted_at IS NULL " +
            "      AND e.employment_status <> 'TERMINATED'" +
            "  ) AS employee_count " +
            "FROM " + HrTables.LOCATIONS + " l " +
            "JOIN " + HrTables.COUNTRIES + " c ON c.country_id = l.country_id " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " l_city_locale ON l_city_locale.entity_type = 'LOCATION' " +
            "  AND l_city_locale.entity_key = CAST(l.location_id AS varchar(60)) " +
            "  AND l_city_locale.field_name = 'city' " +
            "  AND l_city_locale.locale_code = ? " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " l_city_en ON l_city_en.entity_type = 'LOCATION' " +
            "  AND l_city_en.entity_key = CAST(l.location_id AS varchar(60)) " +
            "  AND l_city_en.field_name = 'city' " +
            "  AND l_city_en.locale_code = 'en-US' " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " l_state_locale ON l_state_locale.entity_type = 'LOCATION' " +
            "  AND l_state_locale.entity_key = CAST(l.location_id AS varchar(60)) " +
            "  AND l_state_locale.field_name = 'state_province' " +
            "  AND l_state_locale.locale_code = ? " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " l_state_en ON l_state_en.entity_type = 'LOCATION' " +
            "  AND l_state_en.entity_key = CAST(l.location_id AS varchar(60)) " +
            "  AND l_state_en.field_name = 'state_province' " +
            "  AND l_state_en.locale_code = 'en-US' " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " c_name_locale ON c_name_locale.entity_type = 'COUNTRY' " +
            "  AND c_name_locale.entity_key = c.country_id " +
            "  AND c_name_locale.field_name = 'country_name' " +
            "  AND c_name_locale.locale_code = ? " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " c_name_en ON c_name_en.entity_type = 'COUNTRY' " +
            "  AND c_name_en.entity_key = c.country_id " +
            "  AND c_name_en.field_name = 'country_name' " +
            "  AND c_name_en.locale_code = 'en-US' " +
            "ORDER BY city, l.location_id";

    public List<HrLocationDTO> findAll() {
        try (Connection connection = getConnection();
             PreparedStatement stmt = connection.prepareStatement(FIND_ALL_SQL)) {
            int index = 1;
            index = bindCurrentLocale(stmt, index);
            index = bindCurrentLocale(stmt, index);
            bindCurrentLocale(stmt, index);
            try (ResultSet rs = stmt.executeQuery()) {
                List<HrLocationDTO> locations = new ArrayList<>();
                while (rs.next()) {
                    locations.add(mapRow(rs));
                }
                return locations;
            }
        } catch (SQLException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    private HrLocationDTO mapRow(ResultSet rs) throws SQLException {
        HrLocationDTO dto = new HrLocationDTO();
        dto.setLocationId(rs.getInt("location_id"));
        dto.setStreetAddress(rs.getString("street_address"));
        dto.setPostalCode(rs.getString("postal_code"));
        dto.setCity(rs.getString("city"));
        dto.setStateProvince(rs.getString("state_province"));
        dto.setCountryId(rs.getString("country_id"));
        dto.setCountryName(rs.getString("country_name"));
        dto.setEmployeeCount(getInteger(rs, "employee_count"));
        return dto;
    }

    private Integer getInteger(ResultSet rs, String column) throws SQLException {
        int value = rs.getInt(column);
        return rs.wasNull() ? null : value;
    }
}
