package com.company.hr.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data @AllArgsConstructor
public class HrLoginResponse {
    private String token;
    private String refreshToken;
    private long expiresIn;       // milliseconds
    private UserInfo user;

    @Data @AllArgsConstructor
    public static class UserInfo {
        private Integer userId;
        private Integer employeeId;
        private String username;
        private String fullName;
        private String role;       // Primary role (highest privilege)
    }
}
