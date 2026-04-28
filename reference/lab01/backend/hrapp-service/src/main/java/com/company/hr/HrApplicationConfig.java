package com.company.hr;

import com.company.hr.common.log.HrLogHelper;
import com.company.hr.common.format.HrFormatter;
import com.company.hr.config.HrJwtConfig;
import com.company.hr.config.HrObjectMapperProvider;
import com.company.hr.config.HrRuntimeConfig;
import com.company.hr.exception.HrApplicationExceptionMapper;
import com.company.hr.filter.HrCorsResponseFilter;
import com.company.hr.filter.HrLocaleContextFilter;
import com.company.hr.repository.HrAuditLogJdbcRepository;
import com.company.hr.repository.HrAuthJdbcRepository;
import com.company.hr.repository.HrDashboardSummaryJdbcRepository;
import com.company.hr.repository.HrDepartmentJdbcRepository;
import com.company.hr.repository.HrEmployeeCommandJdbcRepository;
import com.company.hr.repository.HrEmployeeJdbcRepository;
import com.company.hr.repository.HrJobJdbcRepository;
import com.company.hr.resource.HrAuthResource;
import com.company.hr.resource.HrAuditLogResource;
import com.company.hr.resource.HrDashboardResource;
import com.company.hr.resource.HrDepartmentResource;
import com.company.hr.resource.HrEmployeeResource;
import com.company.hr.resource.HrHealthResource;
import com.company.hr.resource.HrJobResource;
import com.company.hr.resource.HrNotificationResource;
import com.company.hr.resource.HrRegionResource;
import com.company.hr.resource.HrUserPreferencesResource;
import com.company.hr.security.HrJwtRequestFilter;
import com.company.hr.security.HrJwtService;
import com.company.hr.service.HrAuthService;
import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.jackson.JacksonFeature;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.ServerProperties;

/**
 * Lab 01 escape-hatch application config with the Region resource wired in.
 */
public class HrApplicationConfig extends ResourceConfig {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrApplicationConfig.class);

    public HrApplicationConfig(HrRuntimeConfig runtimeConfig) {
        LOGGER.info("Configuring Jersey runtime for basePath={}", runtimeConfig.basePath());
        property("hr.runtime.basePath", runtimeConfig.basePath());
        property(ServerProperties.WADL_FEATURE_DISABLE, true);
        HrJwtConfig jwtConfig = HrJwtConfig.fromEnvironment();
        HrJwtService jwtService = new HrJwtService(jwtConfig);
        register(JacksonFeature.class);
        register(HrObjectMapperProvider.class);
        register(HrApplicationExceptionMapper.class);
        register(new AbstractBinder() {
            @Override
            protected void configure() {
                bind(new HrAuthService(jwtService, jwtConfig, new HrAuthJdbcRepository())).to(HrAuthService.class);
                bind(new HrAuditLogJdbcRepository()).to(HrAuditLogJdbcRepository.class);
                bind(new HrDashboardSummaryJdbcRepository()).to(HrDashboardSummaryJdbcRepository.class);
                bind(new HrDepartmentJdbcRepository()).to(HrDepartmentJdbcRepository.class);
                bind(new HrEmployeeJdbcRepository()).to(HrEmployeeJdbcRepository.class);
                bind(new HrEmployeeCommandJdbcRepository()).to(HrEmployeeCommandJdbcRepository.class);
                bind(new HrFormatter()).to(HrFormatter.class);
                bind(new HrJobJdbcRepository()).to(HrJobJdbcRepository.class);
            }
        });
        register(new HrCorsResponseFilter(runtimeConfig.corsAllowedOrigins()));
        register(new HrJwtRequestFilter(jwtService));
        register(new HrLocaleContextFilter());
        register(HrAuthResource.class);
        register(HrHealthResource.class);
        register(HrDepartmentResource.class);
        register(HrJobResource.class);
        register(HrAuditLogResource.class);
        register(HrNotificationResource.class);
        register(HrUserPreferencesResource.class);
        register(HrDashboardResource.class);
        register(HrEmployeeResource.class);
        register(HrRegionResource.class);
    }
}
