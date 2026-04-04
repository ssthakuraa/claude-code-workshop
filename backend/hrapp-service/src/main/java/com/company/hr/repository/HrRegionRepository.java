package com.company.hr.repository;

import com.company.hr.model.HrRegion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HrRegionRepository extends JpaRepository<HrRegion, Integer> {
}
