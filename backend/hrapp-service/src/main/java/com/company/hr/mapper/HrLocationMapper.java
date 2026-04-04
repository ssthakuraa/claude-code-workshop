package com.company.hr.mapper;

import com.company.hr.dto.request.HrLocationRequest;
import com.company.hr.dto.response.HrLocationDTO;
import com.company.hr.model.HrLocation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface HrLocationMapper {

    @Mapping(source = "country.countryId", target = "countryId")
    @Mapping(source = "country.countryName", target = "countryName")
    HrLocationDTO toDTO(HrLocation entity);

    @Mapping(target = "country", ignore = true)
    HrLocation fromRequest(HrLocationRequest request);
}
