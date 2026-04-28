package com.company.hr.service;

import com.company.hr.common.exception.HrUnauthorizedException;
import com.company.hr.common.log.HrLogHelper;
import com.company.hr.config.HrJwtConfig;
import com.company.hr.dto.request.HrLoginRequest;
import com.company.hr.dto.response.HrLoginResponse;
import com.company.hr.repository.HrAuthJdbcRepository;
import com.company.hr.repository.HrAuthUserRecord;
import com.company.hr.security.HrPasswordHasher;
import com.company.hr.security.HrJwtService;
import io.jsonwebtoken.JwtException;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.List;

/**
 * Coordinates login and refresh-token flows for the Jersey runtime.
 */
public class HrAuthService {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrAuthService.class);

    private final HrJwtService jwtService;
    private final HrAuthJdbcRepository authRepository;
    private final long accessTokenExpiresInMillis;

    public HrAuthService(HrJwtService jwtService, HrAuthJdbcRepository authRepository) {
        this(jwtService, authRepository, 1_800_000L);
    }

    public HrAuthService(HrJwtService jwtService, HrJwtConfig jwtConfig, HrAuthJdbcRepository authRepository) {
        this(jwtService, authRepository, jwtConfig.getExpiration());
    }

    HrAuthService(HrJwtService jwtService,
                  HrAuthJdbcRepository authRepository,
                  long accessTokenExpiresInMillis) {
        this.jwtService = jwtService;
        this.authRepository = authRepository;
        this.accessTokenExpiresInMillis = accessTokenExpiresInMillis;
    }

    public HrLoginResponse authenticate(HrLoginRequest request) {
        HrAuthUserRecord user = findActiveUserByUsername(request.getUsername(), "INVALID_CREDENTIALS");
        ensurePasswordMatches(request.getPassword(), user.passwordHash());

        authRepository.updateLastLogin(user.userId(), Instant.now());
        LOGGER.info("Authentication succeeded for userId={}", user.userId());
        return buildLoginResponse(user);
    }

    public HrLoginResponse refreshToken(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new HrUnauthorizedException("REFRESH_TOKEN_INVALID");
        }

        final String username;
        try {
            username = jwtService.extractUsername(refreshToken);
            if (username == null
                    || jwtService.isTokenExpired(refreshToken)
                    || !jwtService.isRefreshToken(refreshToken)) {
                throw new HrUnauthorizedException("REFRESH_TOKEN_INVALID");
            }
        } catch (JwtException | IllegalArgumentException ex) {
            throw new HrUnauthorizedException("REFRESH_TOKEN_INVALID");
        }

        HrAuthUserRecord user = findActiveUserByUsername(username, "REFRESH_TOKEN_INVALID");
        LOGGER.info("Refresh token accepted for userId={}", user.userId());
        return buildLoginResponse(user);
    }

    private String determinePrimaryRole(List<String> roles) {
        if (roles.contains("ROLE_ADMIN") || roles.contains("ADMIN")) return "ADMIN";
        if (roles.contains("ROLE_HR_SPECIALIST") || roles.contains("HR_SPECIALIST")) return "HR_SPECIALIST";
        if (roles.contains("ROLE_MANAGER") || roles.contains("MANAGER")) return "MANAGER";
        return "EMPLOYEE";
    }

    private HrAuthUserRecord findActiveUserByUsername(String username, String errorCode) {
        return authRepository.findByUsername(username)
                .map(user -> {
                    if (!user.active()) {
                        throw new HrUnauthorizedException("ACCOUNT_DISABLED");
                    }
                    return user;
                })
                .orElseThrow(() -> new HrUnauthorizedException(errorCode));
    }

    private void ensurePasswordMatches(String rawPassword, String storedHash) {
        if (!HrPasswordHasher.matches(rawPassword, storedHash)) {
            throw new HrUnauthorizedException("INVALID_CREDENTIALS");
        }
    }

    private HrLoginResponse buildLoginResponse(HrAuthUserRecord user) {
        List<String> roles = normalizeRoles(user.roles());
        String username = user.username();
        Integer employeeId = user.employeeId();
        String token = jwtService.generateToken(username, roles, employeeId);
        String refreshToken = jwtService.generateRefreshToken(username);

        return new HrLoginResponse(
                token,
                refreshToken,
                accessTokenExpiresInMillis,
                new HrLoginResponse.UserInfo(
                        user.userId(),
                        employeeId,
                        username,
                        buildFullName(user),
                        determinePrimaryRole(roles)
                )
        );
    }

    private List<String> normalizeRoles(List<String> roles) {
        if (roles == null || roles.isEmpty()) {
            return List.of("ROLE_EMPLOYEE");
        }

        LinkedHashSet<String> normalized = new LinkedHashSet<>();
        for (String role : roles) {
            if (role == null || role.isBlank()) {
                continue;
            }
            normalized.add(role);
            if (!role.startsWith("ROLE_")) {
                normalized.add("ROLE_" + role);
            }
        }
        return normalized.isEmpty() ? List.of("ROLE_EMPLOYEE") : List.copyOf(normalized);
    }

    private String buildFullName(HrAuthUserRecord user) {
        if (user.fullName() == null || user.fullName().isBlank()) {
            return user.username();
        }
        return user.fullName();
    }
}
