package com.company.hr.repository;

import com.company.hr.model.HrJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HrJobRepository extends JpaRepository<HrJob, String> {
}
