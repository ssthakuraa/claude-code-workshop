package com.company.hr.service;

import com.company.hr.common.exception.HrBusinessRuleViolationException;
import com.company.hr.common.exception.HrConflictException;
import com.company.hr.common.exception.HrResourceNotFoundException;
import com.company.hr.common.log.HrLogHelper;
import com.company.hr.dto.request.HrJobRequest;
import com.company.hr.dto.response.HrJobDTO;
import com.company.hr.mapper.HrJobMapper;
import com.company.hr.model.HrJob;
import com.company.hr.repository.HrJobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HrJobService {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrJobService.class);

    private final HrJobRepository repository;
    private final HrJobMapper mapper;

    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    @Cacheable("jobs")
    public List<HrJobDTO> findAll() {
        LOGGER.info("Entering findAll() — cache miss, loading from DB");
        List<HrJobDTO> result = repository.findAll().stream()
                .map(mapper::toDTO).collect(Collectors.toList());
        LOGGER.info("Exiting findAll(), {} jobs", result.size());
        return result;
    }

    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public HrJobDTO findById(String id) {
        LOGGER.info("Entering findById(id={})", id);
        return repository.findById(id).map(mapper::toDTO)
                .orElseThrow(() -> new HrResourceNotFoundException("Job", id));
    }

    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN', 'HR_SPECIALIST')")
    @CacheEvict(value = "jobs", allEntries = true)
    public HrJobDTO create(HrJobRequest request) {
        LOGGER.info("Entering create(jobId={})", request.getJobId());
        if (repository.existsById(request.getJobId())) {
            throw new HrConflictException("Job with ID " + request.getJobId() + " already exists.");
        }
        validateSalaryRange(request);
        HrJobDTO result = mapper.toDTO(repository.save(mapper.fromRequest(request)));
        LOGGER.info("Exiting create, saved job: {}", result.getJobTitle());
        return result;
    }

    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN', 'HR_SPECIALIST')")
    @CacheEvict(value = "jobs", allEntries = true)
    public HrJobDTO update(String id, HrJobRequest request) {
        LOGGER.info("Entering update(id={})", id);
        HrJob job = repository.findById(id)
                .orElseThrow(() -> new HrResourceNotFoundException("Job", id));
        validateSalaryRange(request);
        mapper.updateFromRequest(request, job);
        return mapper.toDTO(repository.save(job));
    }

    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN')")
    @CacheEvict(value = "jobs", allEntries = true)
    public void delete(String id) {
        if (!repository.existsById(id)) throw new HrResourceNotFoundException("Job", id);
        repository.deleteById(id);
    }

    private void validateSalaryRange(HrJobRequest request) {
        if (request.getMinSalary() != null && request.getMaxSalary() != null
                && request.getMinSalary().compareTo(request.getMaxSalary()) >= 0) {
            throw new HrBusinessRuleViolationException(
                    "Minimum salary must be less than maximum salary.", "INVALID_SALARY_RANGE");
        }
    }
}
