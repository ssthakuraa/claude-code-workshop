package com.company.hr.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Authentication response containing access tokens and user context.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HrLoginResponse {
    private String token;
    private String refreshToken;
    private long expiresIn;       // milliseconds
    private UserInfo user;

    /**
     * Authenticated user context returned with a successful login.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private Integer userId;
        private Integer employeeId;
        private String username;
        private String fullName;
        private String role;       // Primary role (highest privilege)
    }
}
