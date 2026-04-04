package com.company.hr.service;

import com.company.hr.common.exception.HrConflictException;
import com.company.hr.common.exception.HrResourceNotFoundException;
import com.company.hr.common.log.HrLogHelper;
import com.company.hr.dto.request.HrCountryRequest;
import com.company.hr.dto.response.HrCountryDTO;
import com.company.hr.mapper.HrCountryMapper;
import com.company.hr.model.HrCountry;
import com.company.hr.model.HrRegion;
import com.company.hr.repository.HrCountryRepository;
import com.company.hr.repository.HrRegionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HrCountryService {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrCountryService.class);

    private final HrCountryRepository repository;
    private final HrRegionRepository regionRepository;
    private final HrCountryMapper mapper;

    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public List<HrCountryDTO> findAll() {
        LOGGER.info("Entering findAll()");
        List<HrCountryDTO> result = repository.findAll().stream()
                .map(mapper::toDTO).collect(Collectors.toList());
        LOGGER.info("Exiting findAll(), {} countries", result.size());
        return result;
    }

    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public List<HrCountryDTO> findByRegion(Integer regionId) {
        LOGGER.info("Entering findByRegion(regionId={})", regionId);
        return repository.findByRegion_RegionId(regionId).stream()
                .map(mapper::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public HrCountryDTO findById(String id) {
        LOGGER.info("Entering findById(id={})", id);
        return repository.findById(id)
                .map(mapper::toDTO)
                .orElseThrow(() -> new HrResourceNotFoundException("Country", id));
    }

    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN')")
    public HrCountryDTO create(HrCountryRequest request) {
        LOGGER.info("Entering create(countryId={})", request.getCountryId());
        if (repository.existsById(request.getCountryId())) {
            throw new HrConflictException("Country with ID " + request.getCountryId() + " already exists.");
        }
        HrRegion region = regionRepository.findById(request.getRegionId())
                .orElseThrow(() -> new HrResourceNotFoundException("Region", request.getRegionId()));
        HrCountry country = mapper.fromRequest(request);
        country.setRegion(region);
        HrCountryDTO result = mapper.toDTO(repository.save(country));
        LOGGER.info("Exiting create, saved country: {}", result.getCountryName());
        return result;
    }

    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN')")
    public HrCountryDTO update(String id, HrCountryRequest request) {
        LOGGER.info("Entering update(id={})", id);
        HrCountry country = repository.findById(id)
                .orElseThrow(() -> new HrResourceNotFoundException("Country", id));
        country.setCountryName(request.getCountryName());
        if (request.getRegionId() != null) {
            HrRegion region = regionRepository.findById(request.getRegionId())
                    .orElseThrow(() -> new HrResourceNotFoundException("Region", request.getRegionId()));
            country.setRegion(region);
        }
        return mapper.toDTO(repository.save(country));
    }

    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN')")
    public void delete(String id) {
        LOGGER.info("Entering delete(id={})", id);
        if (!repository.existsById(id)) throw new HrResourceNotFoundException("Country", id);
        repository.deleteById(id);
        LOGGER.info("Exiting delete, deleted country: {}", id);
    }
}
