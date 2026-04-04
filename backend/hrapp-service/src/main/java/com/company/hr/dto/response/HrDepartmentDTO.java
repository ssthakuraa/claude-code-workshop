package com.company.hr.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class HrDepartmentDTO {
    private Integer departmentId;
    private String departmentName;
    private Integer managerId;
    private String managerName;
    private Integer locationId;
    private String locationCity;
    private Integer parentDepartmentId;
    private String parentDepartmentName;
    private List<HrDepartmentDTO> children;  // Only populated in tree view
    private Integer employeeCount;           // Optional — populated on demand
}
