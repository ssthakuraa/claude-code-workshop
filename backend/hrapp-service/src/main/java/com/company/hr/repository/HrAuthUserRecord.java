package com.company.hr.repository;

import java.time.Instant;
import java.util.List;

/**
 * Compact auth projection loaded directly from AIHR auth tables.
 */
public record HrAuthUserRecord(
        Integer userId,
        Integer employeeId,
        String username,
        String passwordHash,
        boolean active,
        Instant lastLogin,
        String fullName,
        List<String> roles
) {
}
