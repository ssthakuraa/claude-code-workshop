package com.company.hr.service;

import com.company.hr.common.exception.HrUnauthorizedException;
import com.company.hr.config.HrJwtConfig;
import com.company.hr.dto.request.HrLoginRequest;
import com.company.hr.dto.response.HrLoginResponse;
import com.company.hr.repository.HrAuthUserRecord;
import com.company.hr.security.HrJwtService;
import com.company.hr.security.HrPasswordHasher;
import com.company.hr.testsupport.StubHrAuthRepository;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class HrAuthServiceTest {

    private static final String PASSWORD = "password123";
    private static final String PASSWORD_HASH = HrPasswordHasher.hash(PASSWORD);

    @Test
    void authenticateReturnsTokensAndPrimaryRole() {
        HrAuthService service = new HrAuthService(jwtService(), new StubHrAuthRepository(activeUser()), 1_800_000L);

        HrLoginRequest request = new HrLoginRequest();
        request.setUsername("steven.king");
        request.setPassword(PASSWORD);

        HrLoginResponse response = service.authenticate(request);

        assertThat(response.getToken()).isNotBlank();
        assertThat(response.getRefreshToken()).isNotBlank();
        assertThat(response.getExpiresIn()).isEqualTo(1_800_000L);
        assertThat(response.getUser().getUsername()).isEqualTo("steven.king");
        assertThat(response.getUser().getFullName()).isEqualTo("Steven King");
        assertThat(response.getUser().getRole()).isEqualTo("ADMIN");
    }

    @Test
    void refreshTokenReturnsNewTokensForActiveUser() {
        HrAuthService service = new HrAuthService(jwtService(), new StubHrAuthRepository(activeUser()), 1_800_000L);

        String refreshToken = jwtService().generateRefreshToken("steven.king");

        HrLoginResponse response = service.refreshToken(refreshToken);

        assertThat(response.getToken()).isNotBlank();
        assertThat(response.getRefreshToken()).isNotBlank();
        assertThat(response.getUser().getUserId()).isEqualTo(1);
    }

    @Test
    void refreshTokenRejectsAccessTokens() {
        HrJwtService jwtService = jwtService();
        HrAuthService service = new HrAuthService(jwtService, new StubHrAuthRepository(activeUser()), 1_800_000L);

        String accessToken = jwtService.generateToken("steven.king", List.of("ROLE_ADMIN"), 100);

        assertThatThrownBy(() -> service.refreshToken(accessToken))
                .isInstanceOf(HrUnauthorizedException.class)
                .hasMessage("REFRESH_TOKEN_INVALID");
    }

    @Test
    void authenticateRejectsInvalidPassword() {
        HrAuthService service = new HrAuthService(jwtService(), new StubHrAuthRepository(activeUser()), 1_800_000L);

        HrLoginRequest request = new HrLoginRequest();
        request.setUsername("steven.king");
        request.setPassword("wrong-password");

        assertThatThrownBy(() -> service.authenticate(request))
                .isInstanceOf(HrUnauthorizedException.class)
                .hasMessage("INVALID_CREDENTIALS");
    }

    @Test
    void refreshTokenRejectsMissingToken() {
        HrAuthService service = new HrAuthService(jwtService(), new StubHrAuthRepository(activeUser()), 1_800_000L);

        assertThatThrownBy(() -> service.refreshToken(null))
                .isInstanceOf(HrUnauthorizedException.class)
                .hasMessage("REFRESH_TOKEN_INVALID");
    }

    private HrJwtService jwtService() {
        HrJwtConfig config = new HrJwtConfig();
        config.setSecret("test-secret-key-with-sufficient-length");
        config.setExpiration(1_800_000L);
        config.setRefreshExpiration(604_800_000L);
        return new HrJwtService(config);
    }

    private HrAuthUserRecord activeUser() {
        return new HrAuthUserRecord(
                1,
                100,
                "steven.king",
                PASSWORD_HASH,
                true,
                Instant.parse("2026-03-25T08:15:00Z"),
                "Steven King",
                List.of("ROLE_ADMIN", "ROLE_EMPLOYEE")
        );
    }
}
