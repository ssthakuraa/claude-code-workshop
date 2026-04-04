package com.company.hr.service;

import com.company.hr.common.exception.HrConflictException;
import com.company.hr.common.exception.HrResourceNotFoundException;
import com.company.hr.common.log.HrLogHelper;
import com.company.hr.dto.request.HrLocationRequest;
import com.company.hr.dto.response.HrLocationDTO;
import com.company.hr.mapper.HrLocationMapper;
import com.company.hr.model.HrCountry;
import com.company.hr.model.HrLocation;
import com.company.hr.repository.HrCountryRepository;
import com.company.hr.repository.HrLocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HrLocationService {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrLocationService.class);

    private final HrLocationRepository repository;
    private final HrCountryRepository countryRepository;
    private final HrLocationMapper mapper;

    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public List<HrLocationDTO> findAll() {
        LOGGER.info("Entering findAll()");
        return repository.findAll().stream().map(mapper::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public List<HrLocationDTO> findByCountry(String countryId) {
        return repository.findByCountry_CountryId(countryId).stream()
                .map(mapper::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public HrLocationDTO findById(Integer id) {
        return repository.findById(id).map(mapper::toDTO)
                .orElseThrow(() -> new HrResourceNotFoundException("Location", id));
    }

    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN')")
    public HrLocationDTO create(HrLocationRequest request) {
        LOGGER.info("Entering create(locationId={})", request.getLocationId());
        if (repository.existsById(request.getLocationId())) {
            throw new HrConflictException("Location with ID " + request.getLocationId() + " already exists.");
        }
        HrCountry country = countryRepository.findById(request.getCountryId())
                .orElseThrow(() -> new HrResourceNotFoundException("Country", request.getCountryId()));
        HrLocation location = mapper.fromRequest(request);
        location.setCountry(country);
        HrLocationDTO result = mapper.toDTO(repository.save(location));
        LOGGER.info("Exiting create, saved location: {}", result.getCity());
        return result;
    }

    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN')")
    public HrLocationDTO update(Integer id, HrLocationRequest request) {
        LOGGER.info("Entering update(id={})", id);
        HrLocation location = repository.findById(id)
                .orElseThrow(() -> new HrResourceNotFoundException("Location", id));
        location.setStreetAddress(request.getStreetAddress());
        location.setPostalCode(request.getPostalCode());
        location.setCity(request.getCity());
        location.setStateProvince(request.getStateProvince());
        if (request.getCountryId() != null) {
            HrCountry country = countryRepository.findById(request.getCountryId())
                    .orElseThrow(() -> new HrResourceNotFoundException("Country", request.getCountryId()));
            location.setCountry(country);
        }
        return mapper.toDTO(repository.save(location));
    }

    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN')")
    public void delete(Integer id) {
        if (!repository.existsById(id)) throw new HrResourceNotFoundException("Location", id);
        repository.deleteById(id);
    }
}
