package com.company.hr.repository;

import com.company.hr.model.HrUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HrUserRepository extends JpaRepository<HrUser, Integer> {
    Optional<HrUser> findByUsername(String username);
    boolean existsByUsername(String username);
    Optional<HrUser> findByEmployee_EmployeeId(Integer employeeId);
}
