package com.company.hr.service;

import com.company.hr.common.exception.HrConflictException;
import com.company.hr.common.exception.HrResourceNotFoundException;
import com.company.hr.dto.request.HrRegionRequest;
import com.company.hr.dto.response.HrRegionDTO;
import com.company.hr.mapper.HrRegionMapper;
import com.company.hr.model.HrRegion;
import com.company.hr.repository.HrRegionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HrRegionServiceTest {

    @Mock HrRegionRepository repository;
    @Mock HrRegionMapper mapper;
    @InjectMocks HrRegionService service;

    @Test
    void findAll_returnsAllRegions() {
        HrRegion region = new HrRegion();
        HrRegionDTO dto = new HrRegionDTO();
        dto.setRegionName("Europe");

        when(repository.findAll()).thenReturn(List.of(region));
        when(mapper.toDTO(region)).thenReturn(dto);

        assertThat(service.findAll()).hasSize(1);
    }

    @Test
    void findById_throwsNotFound_whenMissing() {
        when(repository.findById(99)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.findById(99))
                .isInstanceOf(HrResourceNotFoundException.class);
    }

    @Test
    void create_throwsConflict_whenIdExists() {
        HrRegionRequest req = new HrRegionRequest();
        req.setRegionId(1);
        when(repository.existsById(1)).thenReturn(true);
        assertThatThrownBy(() -> service.create(req))
                .isInstanceOf(HrConflictException.class);
    }

    @Test
    void delete_throwsNotFound_whenMissing() {
        when(repository.existsById(99)).thenReturn(false);
        assertThatThrownBy(() -> service.delete(99))
                .isInstanceOf(HrResourceNotFoundException.class);
    }
}
