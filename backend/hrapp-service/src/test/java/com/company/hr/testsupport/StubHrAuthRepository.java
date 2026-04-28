package com.company.hr.testsupport;

import com.company.hr.repository.HrAuthJdbcRepository;
import com.company.hr.repository.HrAuthUserRecord;

import java.time.Instant;
import java.util.Optional;

/**
 * Small in-memory auth repository for Jersey-era auth tests.
 */
public class StubHrAuthRepository extends HrAuthJdbcRepository {

    private final HrAuthUserRecord user;

    public StubHrAuthRepository(HrAuthUserRecord user) {
        this.user = user;
    }

    @Override
    public Optional<HrAuthUserRecord> findByUsername(String username) {
        if (user != null && user.username().equalsIgnoreCase(username)) {
            return Optional.of(user);
        }
        return Optional.empty();
    }

    @Override
    public void updateLastLogin(Integer userId, Instant lastLogin) {
        // no-op for unit tests
    }
}
