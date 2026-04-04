package com.company.hr.mapper;

import com.company.hr.dto.request.HrJobRequest;
import com.company.hr.dto.response.HrJobDTO;
import com.company.hr.model.HrJob;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface HrJobMapper {
    HrJobDTO toDTO(HrJob entity);
    HrJob fromRequest(HrJobRequest request);
    void updateFromRequest(HrJobRequest request, @MappingTarget HrJob entity);
}
