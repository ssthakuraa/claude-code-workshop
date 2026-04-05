package com.company.hr.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data @NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class HrDashboardSummaryDTO {

    private long totalHeadcount;
    private long activeCount;
    private long onLeaveCount;
    private long probationCount;
    private long newHiresThisMonth;
    private long terminationsThisMonth;
    private List<DeptCount> headcountByDepartment;
    private List<StatusCount> headcountByStatus;

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class DeptCount {
        private String departmentName;
        private long count;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class StatusCount {
        private String status;
        private long count;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class CountryCount {
        private String countryName;
        private long count;
    }
}
