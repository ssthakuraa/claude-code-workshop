package com.company.hr.mapper;

import com.company.hr.dto.request.HrRegionRequest;
import com.company.hr.dto.response.HrRegionDTO;
import com.company.hr.model.HrRegion;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface HrRegionMapper {
    HrRegionDTO toDTO(HrRegion entity);
    HrRegion fromRequest(HrRegionRequest request);
    void updateFromRequest(HrRegionRequest request, @MappingTarget HrRegion entity);
}
