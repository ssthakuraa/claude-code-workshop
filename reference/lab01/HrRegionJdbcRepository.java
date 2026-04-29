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
 * JDBC-backed region repository for the Jersey read endpoint.
 */
public class HrRegionJdbcRepository extends HrJdbcRepository {

    private static final String FIND_ALL_SQL =
            "SELECT region_id, region_name " +
            "FROM AIHR_REGIONS " +
            "WHERE deleted_at IS NULL " +
            "ORDER BY region_name";

    public List<HrRegionDTO> findAll() {
        try (Connection connection = getConnection();
             PreparedStatement stmt = connection.prepareStatement(FIND_ALL_SQL)) {
            try (ResultSet rs = stmt.executeQuery()) {
                List<HrRegionDTO> regions = new ArrayList<>();
                while (rs.next()) {
                    regions.add(mapRow(rs));
                }
                return regions;
            }
        } catch (SQLException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    private HrRegionDTO mapRow(ResultSet rs) throws SQLException {
        HrRegionDTO dto = new HrRegionDTO();
        dto.setRegionId(rs.getInt("region_id"));
        dto.setRegionName(rs.getString("region_name"));
        return dto;
    }
}
