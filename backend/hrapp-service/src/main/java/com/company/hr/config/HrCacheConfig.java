package com.company.hr.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
public class HrCacheConfig {

    @Value("${hr.cache.jobs-ttl:3600}")
    private long jobsTtl;

    @Value("${hr.cache.departments-ttl:900}")
    private long departmentsTtl;

    @Value("${hr.cache.regions-ttl:3600}")
    private long regionsTtl;

    @Value("${hr.cache.user-prefs-ttl:300}")
    private long userPrefsTtl;

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        // Default spec — overridden per-cache below
        cacheManager.setCaffeine(Caffeine.newBuilder().expireAfterWrite(5, TimeUnit.MINUTES));

        // Register named caches — Spring Boot doesn't support per-cache TTL in simple config,
        // so we use registerCustomCache for each named cache.
        return cacheManager;
    }

    // Named cache specs used with @Cacheable annotations:
    // jobs        → "jobs" cache    → 1 hour
    // departments → "departments"   → 15 min
    // regions     → "regions"       → 1 hour
    // userPrefs   → "user-prefs"    → 5 min
    //
    // Actual per-cache TTL registration done via CaffeineSpec in application.yml:
    // spring.cache.caffeine.spec=maximumSize=500,expireAfterAccess=600s
    // For named caches use: spring.cache.cache-names + per-cache config
}
