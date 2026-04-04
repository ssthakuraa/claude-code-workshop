package com.company.hr.service;

import com.company.hr.common.exception.HrConflictException;
import com.company.hr.common.exception.HrResourceNotFoundException;
import com.company.hr.common.log.HrLogHelper;
import com.company.hr.dto.request.HrRegionRequest;
import com.company.hr.dto.response.HrRegionDTO;
import com.company.hr.mapper.HrRegionMapper;
import com.company.hr.model.HrRegion;
import com.company.hr.repository.HrRegionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HrRegionService {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrRegionService.class);

    private final HrRegionRepository repository;
    private final HrRegionMapper mapper;

    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public List<HrRegionDTO> findAll() {
        LOGGER.info("Entering findAll()");
        List<HrRegionDTO> result = repository.findAll().stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
        LOGGER.info("Exiting findAll(), returned {} regions", result.size());
        return result;
    }

    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public HrRegionDTO findById(Integer id) {
        LOGGER.info("Entering findById(id={})", id);
        HrRegionDTO result = repository.findById(id)
                .map(mapper::toDTO)
                .orElseThrow(() -> new HrResourceNotFoundException("Region", id));
        LOGGER.info("Exiting findById, found: {}", result.getRegionName());
        return result;
    }

    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN')")
    public HrRegionDTO create(HrRegionRequest request) {
        LOGGER.info("Entering create(regionId={})", request.getRegionId());
        if (repository.existsById(request.getRegionId())) {
            throw new HrConflictException("Region with ID " + request.getRegionId() + " already exists.", "REGION_ID_EXISTS");
        }
        HrRegion saved = repository.save(mapper.fromRequest(request));
        LOGGER.info("Exiting create, saved region ID={}", saved.getRegionId());
        return mapper.toDTO(saved);
    }

    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN')")
    public HrRegionDTO update(Integer id, HrRegionRequest request) {
        LOGGER.info("Entering update(id={})", id);
        HrRegion region = repository.findById(id)
                .orElseThrow(() -> new HrResourceNotFoundException("Region", id));
        mapper.updateFromRequest(request, region);
        HrRegionDTO result = mapper.toDTO(repository.save(region));
        LOGGER.info("Exiting update, updated region: {}", result.getRegionName());
        return result;
    }

    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN')")
    public void delete(Integer id) {
        LOGGER.info("Entering delete(id={})", id);
        if (!repository.existsById(id)) {
            throw new HrResourceNotFoundException("Region", id);
        }
        repository.deleteById(id);
        LOGGER.info("Exiting delete, deleted region ID={}", id);
    }
}
