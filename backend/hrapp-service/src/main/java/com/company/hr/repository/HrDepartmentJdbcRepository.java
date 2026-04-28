package com.company.hr.repository;

import com.company.hr.common.exception.HrApplicationException;
import com.company.hr.dto.response.HrDepartmentDTO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * JDBC-backed department repository for the new Jersey-era read endpoints.
 */
public class HrDepartmentJdbcRepository extends HrJdbcRepository {

    private static final String BASE_DEPARTMENT_SQL =
            "SELECT " +
            "  d.department_id, " +
            "  COALESCE(d_name_locale.translated_value, d_name_en.translated_value, d.department_name) AS department_name, " +
            "  d.manager_id, " +
            "  TRIM(COALESCE(m.first_name || ' ' || m.last_name, m.first_name, m.last_name)) AS manager_name, " +
            "  d.location_id, " +
            "  COALESCE(l_city_locale.translated_value, l_city_en.translated_value, l.city) AS location_city, " +
            "  d.parent_department_id, " +
            "  COALESCE(p_name_locale.translated_value, p_name_en.translated_value, p.department_name) AS parent_department_name, " +
            "  (SELECT COUNT(*) FROM " + HrTables.EMPLOYEES + " e WHERE e.department_id = d.department_id AND e.deleted_at IS NULL) AS employee_count " +
            "FROM " + HrTables.DEPARTMENTS + " d " +
            "LEFT JOIN " + HrTables.EMPLOYEES + " m ON d.manager_id = m.employee_id AND m.deleted_at IS NULL " +
            "LEFT JOIN " + HrTables.LOCATIONS + " l ON d.location_id = l.location_id " +
            "LEFT JOIN " + HrTables.DEPARTMENTS + " p ON d.parent_department_id = p.department_id AND p.deleted_at IS NULL " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " d_name_locale ON d_name_locale.entity_type = 'DEPARTMENT' " +
            "  AND d_name_locale.entity_key = CAST(d.department_id AS varchar(60)) " +
            "  AND d_name_locale.field_name = 'department_name' " +
            "  AND d_name_locale.locale_code = ? " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " d_name_en ON d_name_en.entity_type = 'DEPARTMENT' " +
            "  AND d_name_en.entity_key = CAST(d.department_id AS varchar(60)) " +
            "  AND d_name_en.field_name = 'department_name' " +
            "  AND d_name_en.locale_code = 'en-US' " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " l_city_locale ON l_city_locale.entity_type = 'LOCATION' " +
            "  AND l_city_locale.entity_key = CAST(l.location_id AS varchar(60)) " +
            "  AND l_city_locale.field_name = 'city' " +
            "  AND l_city_locale.locale_code = ? " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " l_city_en ON l_city_en.entity_type = 'LOCATION' " +
            "  AND l_city_en.entity_key = CAST(l.location_id AS varchar(60)) " +
            "  AND l_city_en.field_name = 'city' " +
            "  AND l_city_en.locale_code = 'en-US' " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " p_name_locale ON p_name_locale.entity_type = 'DEPARTMENT' " +
            "  AND p_name_locale.entity_key = CAST(p.department_id AS varchar(60)) " +
            "  AND p_name_locale.field_name = 'department_name' " +
            "  AND p_name_locale.locale_code = ? " +
            "LEFT JOIN " + HrTables.TRANSLATIONS + " p_name_en ON p_name_en.entity_type = 'DEPARTMENT' " +
            "  AND p_name_en.entity_key = CAST(p.department_id AS varchar(60)) " +
            "  AND p_name_en.field_name = 'department_name' " +
            "  AND p_name_en.locale_code = 'en-US' " +
            "WHERE d.deleted_at IS NULL";

    private static final String FIND_ALL_SQL = BASE_DEPARTMENT_SQL + " ORDER BY department_name";

    public List<HrDepartmentDTO> findAll() {
        try (Connection connection = getConnection();
             PreparedStatement stmt = connection.prepareStatement(FIND_ALL_SQL)) {
            int index = 1;
            index = bindCurrentLocale(stmt, index);
            index = bindCurrentLocale(stmt, index);
            bindCurrentLocale(stmt, index);
            try (ResultSet rs = stmt.executeQuery()) {
                List<HrDepartmentDTO> departments = new ArrayList<>();
                while (rs.next()) {
                    departments.add(mapDepartment(rs));
                }
                return departments;
            }
        } catch (SQLException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    public List<HrDepartmentDTO> findHierarchy() {
        List<HrDepartmentDTO> all = findAll();
        Map<Integer, HrDepartmentDTO> byId = new LinkedHashMap<>();
        for (HrDepartmentDTO dto : all) {
            dto.setChildren(new ArrayList<>());
            byId.put(dto.getDepartmentId(), dto);
        }
        List<HrDepartmentDTO> roots = new ArrayList<>();
        for (HrDepartmentDTO dto : all) {
            Integer parentId = dto.getParentDepartmentId();
            if (parentId != null) {
                HrDepartmentDTO parent = byId.get(parentId);
                if (parent != null) {
                    parent.getChildren().add(dto);
                    continue;
                }
            }
            roots.add(dto);
        }
        return roots;
    }

    public Optional<HrDepartmentDTO> findById(Integer departmentId) {
        if (departmentId == null) {
            return Optional.empty();
        }
        String sql = BASE_DEPARTMENT_SQL + " AND d.department_id = ?";
        try (Connection connection = getConnection();
             PreparedStatement stmt = connection.prepareStatement(sql)) {
            int index = 1;
            index = bindCurrentLocale(stmt, index);
            index = bindCurrentLocale(stmt, index);
            index = bindCurrentLocale(stmt, index);
            stmt.setInt(index, departmentId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    HrDepartmentDTO dto = mapDepartment(rs);
                    dto.setChildren(new ArrayList<>());
                    return Optional.of(dto);
                }
                return Optional.empty();
            }
        } catch (SQLException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    private HrDepartmentDTO mapDepartment(ResultSet rs) throws SQLException {
        HrDepartmentDTO dto = new HrDepartmentDTO();
        dto.setDepartmentId(rs.getInt("department_id"));
        dto.setDepartmentName(rs.getString("department_name"));
        Integer managerId = getInteger(rs, "manager_id");
        dto.setManagerId(managerId);
        dto.setManagerName(rs.getString("manager_name"));
        dto.setLocationId(getInteger(rs, "location_id"));
        dto.setLocationCity(rs.getString("location_city"));
        dto.setParentDepartmentId(getInteger(rs, "parent_department_id"));
        dto.setParentDepartmentName(rs.getString("parent_department_name"));
        Integer employeeCount = getInteger(rs, "employee_count");
        dto.setEmployeeCount(employeeCount);
        dto.setChildren(new ArrayList<>());
        return dto;
    }

    private Integer getInteger(ResultSet rs, String column) throws SQLException {
        int value = rs.getInt(column);
        return rs.wasNull() ? null : value;
    }
}
