package com.company.hr.repository;

import com.company.hr.model.HrCountry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HrCountryRepository extends JpaRepository<HrCountry, String> {
    List<HrCountry> findByRegion_RegionId(Integer regionId);
}
