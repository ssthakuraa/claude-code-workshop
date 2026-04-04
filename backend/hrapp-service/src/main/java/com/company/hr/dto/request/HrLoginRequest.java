package com.company.hr.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class HrLoginRequest {
    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;
}
