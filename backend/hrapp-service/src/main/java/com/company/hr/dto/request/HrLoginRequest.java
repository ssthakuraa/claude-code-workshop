package com.company.hr.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Request payload for username and password authentication.
 */
@Data
public class HrLoginRequest {
    @NotBlank(message = "VALIDATION_REQUIRED")
    private String username;

    @NotBlank(message = "VALIDATION_REQUIRED")
    private String password;
}
