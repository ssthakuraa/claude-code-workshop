package com.company.hr.repository;

import com.company.hr.common.exception.HrApplicationException;
import com.company.hr.dto.response.HrRegionDTO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * JDBC-backed region repository for the Lab 01 escape hatch.
 */
public class HrRegionJdbcRepository extends HrJdbcRepository {

    private static final String FIND_ALL_SQL =
            "SELECT r.region_id, " +
            "       COALESCE(r_name_locale.translated_value, r_name_en.translated_value, r.region_name) AS region_name " +
            "FROM " + HrTables.REGIONS + " r " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " r_name_locale ON r_name_locale.entity_type = 'REGION' " +
            "  AND r_name_locale.entity_key = CAST(r.region_id AS varchar(60)) " +
            "  AND r_name_locale.field_name = 'region_name' " +
            "  AND r_name_locale.locale_code = ? " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " r_name_en ON r_name_en.entity_type = 'REGION' " +
            "  AND r_name_en.entity_key = CAST(r.region_id AS varchar(60)) " +
            "  AND r_name_en.field_name = 'region_name' " +
            "  AND r_name_en.locale_code = 'en-US' " +
            "ORDER BY region_name";

    public List<HrRegionDTO> findAll() {
        try (Connection connection = getConnection();
             PreparedStatement stmt = connection.prepareStatement(FIND_ALL_SQL)) {
            bindCurrentLocale(stmt, 1);
            try (ResultSet rs = stmt.executeQuery()) {
                List<HrRegionDTO> regions = new ArrayList<>();
                while (rs.next()) {
                    regions.add(new HrRegionDTO(rs.getInt("region_id"), rs.getString("region_name")));
                }
                return regions;
            }
        } catch (SQLException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }
}
