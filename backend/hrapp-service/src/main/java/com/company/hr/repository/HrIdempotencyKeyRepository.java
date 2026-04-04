package com.company.hr.repository;

import com.company.hr.model.HrIdempotencyKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Repository
public interface HrIdempotencyKeyRepository extends JpaRepository<HrIdempotencyKey, String> {

    @Modifying
    @Transactional
    @Query("DELETE FROM HrIdempotencyKey k WHERE k.expiresAt < :now")
    void deleteExpired(Instant now);
}
