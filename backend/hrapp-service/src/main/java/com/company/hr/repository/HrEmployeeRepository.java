package com.company.hr.repository;

import com.company.hr.model.HrEmployee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HrEmployeeRepository extends JpaRepository<HrEmployee, Integer>,
        JpaSpecificationExecutor<HrEmployee> {

    Optional<HrEmployee> findByEmail(String email);

    boolean existsByEmail(String email);

    List<HrEmployee> findByManager_EmployeeId(Integer managerId);

    @Query("SELECT e FROM HrEmployee e WHERE e.manager.employeeId = :managerId OR e.manager.manager.employeeId = :managerId")
    List<HrEmployee> findDirectAndIndirectReports(Integer managerId);

    Page<HrEmployee> findAll(Specification<HrEmployee> spec, Pageable pageable);
}
