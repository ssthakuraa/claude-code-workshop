package com.company.hr.mapper;

import com.company.hr.dto.request.HrCountryRequest;
import com.company.hr.dto.response.HrCountryDTO;
import com.company.hr.model.HrCountry;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface HrCountryMapper {

    @Mapping(source = "region.regionId", target = "regionId")
    @Mapping(source = "region.regionName", target = "regionName")
    HrCountryDTO toDTO(HrCountry entity);

    @Mapping(target = "region", ignore = true)
    HrCountry fromRequest(HrCountryRequest request);
}
