package com.company.hr.service;

import com.company.hr.common.log.HrLogHelper;
import com.company.hr.dto.request.HrLoginRequest;
import com.company.hr.dto.response.HrLoginResponse;
import com.company.hr.model.HrUser;
import com.company.hr.repository.HrUserRepository;
import com.company.hr.security.HrJwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HrAuthService {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrAuthService.class);

    private final AuthenticationManager authenticationManager;
    private final HrJwtService jwtService;
    private final HrUserRepository userRepository;

    @Transactional
    public HrLoginResponse authenticate(HrLoginRequest request) {
        LOGGER.info("Entering authenticate(username=MASKED)");

        // Spring Security validates credentials and throws on failure
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        HrUser user = userRepository.findByUsername(request.getUsername())
                .orElseThrow();

        // Update last login
        user.setLastLogin(Instant.now());
        userRepository.save(user);

        List<String> roles = user.getRoles().stream()
                .map(r -> r.getRoleName())
                .collect(Collectors.toList());

        Integer employeeId = user.getEmployee() != null ? user.getEmployee().getEmployeeId() : null;
        String token = jwtService.generateToken(user.getUsername(), roles, employeeId);
        String refreshToken = jwtService.generateRefreshToken(user.getUsername());

        String primaryRole = determinePrimaryRole(roles);
        String fullName = user.getEmployee() != null
                ? user.getEmployee().getFirstName() + " " + user.getEmployee().getLastName()
                : user.getUsername();

        LOGGER.info("Exiting authenticate, login successful for userId={}", user.getUserId());

        return new HrLoginResponse(
                token,
                refreshToken,
                1800000L,
                new HrLoginResponse.UserInfo(
                        user.getUserId(),
                        employeeId,
                        user.getUsername(),
                        fullName,
                        primaryRole
                )
        );
    }

    @Transactional
    public HrLoginResponse refreshToken(String refreshToken) {
        LOGGER.info("Entering refreshToken()");
        String username = jwtService.extractUsername(refreshToken);
        if (username == null || jwtService.isTokenExpired(refreshToken)) {
            throw new com.company.hr.common.exception.HrApplicationException(
                    "Invalid or expired refresh token.", "REFRESH_TOKEN_INVALID");
        }
        HrUser user = userRepository.findByUsername(username).orElseThrow();
        List<String> roles = user.getRoles().stream()
                .map(r -> r.getRoleName()).collect(Collectors.toList());
        Integer employeeId = user.getEmployee() != null ? user.getEmployee().getEmployeeId() : null;
        String newToken = jwtService.generateToken(username, roles, employeeId);
        String newRefresh = jwtService.generateRefreshToken(username);
        String fullName = user.getEmployee() != null
                ? user.getEmployee().getFirstName() + " " + user.getEmployee().getLastName()
                : username;
        LOGGER.info("Exiting refreshToken, issued new token for username=MASKED");
        return new HrLoginResponse(newToken, newRefresh, 1800000L,
                new HrLoginResponse.UserInfo(user.getUserId(), employeeId, username, fullName,
                        determinePrimaryRole(roles)));
    }

    private String determinePrimaryRole(List<String> roles) {
        if (roles.contains("ROLE_ADMIN") || roles.contains("ADMIN")) return "ADMIN";
        if (roles.contains("ROLE_HR_SPECIALIST") || roles.contains("HR_SPECIALIST")) return "HR_SPECIALIST";
        if (roles.contains("ROLE_MANAGER") || roles.contains("MANAGER")) return "MANAGER";
        return "EMPLOYEE";
    }
}
