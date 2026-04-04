package com.company.hr.repository;

import com.company.hr.model.HrRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HrRoleRepository extends JpaRepository<HrRole, Integer> {
    Optional<HrRole> findByRoleName(String roleName);
}
