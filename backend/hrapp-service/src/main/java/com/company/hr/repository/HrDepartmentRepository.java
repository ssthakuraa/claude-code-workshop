package com.company.hr.repository;

import com.company.hr.model.HrDepartment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HrDepartmentRepository extends JpaRepository<HrDepartment, Integer> {

    List<HrDepartment> findByParentDepartmentIsNull();

    List<HrDepartment> findByParentDepartment_DepartmentId(Integer parentId);

    @Query("SELECT COUNT(e) FROM HrEmployee e WHERE e.department.departmentId = :deptId AND e.deletedAt IS NULL")
    long countActiveEmployees(Integer deptId);
}
