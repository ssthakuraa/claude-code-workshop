package com.company.hr.service;

import com.company.hr.common.log.HrLogHelper;
import com.company.hr.dto.response.HrDashboardSummaryDTO;
import com.company.hr.model.HrEmployee;
import com.company.hr.repository.HrEmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HrDashboardService {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrDashboardService.class);

    private final HrEmployeeRepository employeeRepository;

    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('ADMIN','HR_SPECIALIST','MANAGER','EMPLOYEE')")
    public HrDashboardSummaryDTO getSummary() {
        LOGGER.info("Entering getSummary()");

        List<HrEmployee> all = employeeRepository.findAll();

        long total = all.size();
        long active = all.stream().filter(e -> e.getEmploymentStatus() == HrEmployee.EmploymentStatus.ACTIVE).count();
        long onLeave = all.stream().filter(e -> e.getEmploymentStatus() == HrEmployee.EmploymentStatus.ON_LEAVE).count();
        long probation = all.stream().filter(e -> e.getEmploymentStatus() == HrEmployee.EmploymentStatus.PROBATION).count();

        LocalDate now = LocalDate.now();
        LocalDate firstOfMonth = now.withDayOfMonth(1);

        long newHires = all.stream()
                .filter(e -> e.getHireDate() != null && !e.getHireDate().isBefore(firstOfMonth))
                .count();

        long terminations = all.stream()
                .filter(e -> e.getEmploymentStatus() == HrEmployee.EmploymentStatus.TERMINATED)
                .count();

        // Headcount by department (active only)
        Map<String, Long> byDept = all.stream()
                .filter(e -> e.getEmploymentStatus() == HrEmployee.EmploymentStatus.ACTIVE)
                .filter(e -> e.getDepartment() != null)
                .collect(Collectors.groupingBy(
                        e -> e.getDepartment().getDepartmentName(),
                        Collectors.counting()
                ));

        List<HrDashboardSummaryDTO.DeptCount> deptCounts = byDept.entrySet().stream()
                .map(en -> new HrDashboardSummaryDTO.DeptCount(en.getKey(), en.getValue()))
                .sorted((a, b) -> Long.compare(b.getCount(), a.getCount()))
                .collect(Collectors.toList());

        // Headcount by status
        Map<HrEmployee.EmploymentStatus, Long> byStatus = all.stream()
                .collect(Collectors.groupingBy(HrEmployee::getEmploymentStatus, Collectors.counting()));

        List<HrDashboardSummaryDTO.StatusCount> statusCounts = byStatus.entrySet().stream()
                .map(en -> new HrDashboardSummaryDTO.StatusCount(en.getKey().name(), en.getValue()))
                .collect(Collectors.toList());

        HrDashboardSummaryDTO dto = new HrDashboardSummaryDTO();
        dto.setTotalHeadcount(total);
        dto.setActiveCount(active);
        dto.setOnLeaveCount(onLeave);
        dto.setProbationCount(probation);
        dto.setNewHiresThisMonth(newHires);
        dto.setTerminationsThisMonth(terminations);
        dto.setHeadcountByDepartment(deptCounts);
        dto.setHeadcountByStatus(statusCounts);

        LOGGER.info("Exiting getSummary(), headcount={}", total);
        return dto;
    }
}
