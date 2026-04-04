package com.company.hr.repository;

import com.company.hr.model.HrLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HrLocationRepository extends JpaRepository<HrLocation, Integer> {
    List<HrLocation> findByCountry_CountryId(String countryId);
}
