package com.company.hr.config;

import com.company.hr.common.log.HrLogHelper;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.ws.rs.ext.ContextResolver;
import jakarta.ws.rs.ext.Provider;

/**
 * Shared Jackson configuration for Jersey resources.
 */
@Provider
public class HrObjectMapperProvider implements ContextResolver<ObjectMapper> {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrObjectMapperProvider.class);
    private final ObjectMapper objectMapper;

    public HrObjectMapperProvider() {
        LOGGER.info("Initializing shared Jackson object mapper");
        this.objectMapper = new ObjectMapper()
                .registerModule(new JavaTimeModule())
                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    @Override
    public ObjectMapper getContext(Class<?> type) {
        return objectMapper;
    }
}
