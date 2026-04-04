package com.company.hr.repository;

import com.company.hr.model.HrJobHistory;
import com.company.hr.model.HrJobHistoryId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HrJobHistoryRepository extends JpaRepository<HrJobHistory, HrJobHistoryId> {
    List<HrJobHistory> findByEmployee_EmployeeIdOrderByIdStartDateDesc(Integer employeeId);
}
