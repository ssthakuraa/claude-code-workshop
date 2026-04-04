package com.company.hr.service;

import com.company.hr.common.exception.HrBusinessRuleViolationException;
import com.company.hr.common.exception.HrResourceNotFoundException;
import com.company.hr.dto.request.HrJobRequest;
import com.company.hr.dto.response.HrJobDTO;
import com.company.hr.mapper.HrJobMapper;
import com.company.hr.model.HrJob;
import com.company.hr.repository.HrJobRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HrJobServiceTest {

    @Mock HrJobRepository repository;
    @Mock HrJobMapper mapper;
    @InjectMocks HrJobService service;

    @Test
    void findById_throwsNotFound_whenMissing() {
        when(repository.findById("UNKNOWN")).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.findById("UNKNOWN"))
                .isInstanceOf(HrResourceNotFoundException.class);
    }

    @Test
    void create_throwsBusinessRule_whenMinSalaryExceedsMax() {
        HrJobRequest req = new HrJobRequest();
        req.setJobId("IT_DEV");
        req.setJobTitle("Developer");
        req.setMinSalary(new BigDecimal("10000"));
        req.setMaxSalary(new BigDecimal("5000")); // invalid

        when(repository.existsById("IT_DEV")).thenReturn(false);

        assertThatThrownBy(() -> service.create(req))
                .isInstanceOf(HrBusinessRuleViolationException.class);
    }

    @Test
    void findById_returnsDTO_whenFound() {
        HrJob job = new HrJob("IT_DEV", "Developer", new BigDecimal("5000"), new BigDecimal("10000"));
        HrJobDTO dto = new HrJobDTO();
        dto.setJobId("IT_DEV");

        when(repository.findById("IT_DEV")).thenReturn(Optional.of(job));
        when(mapper.toDTO(job)).thenReturn(dto);

        assertThat(service.findById("IT_DEV").getJobId()).isEqualTo("IT_DEV");
    }
}
