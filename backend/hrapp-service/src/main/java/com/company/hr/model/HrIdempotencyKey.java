package com.company.hr.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "hr_idempotency_keys")
@Getter @Setter @NoArgsConstructor
public class HrIdempotencyKey {

    @Id
    @Column(name = "idempotency_key", length = 64)
    private String idempotencyKey;

    @Column(name = "endpoint", length = 100, nullable = false)
    private String endpoint;

    @Column(name = "response_status", nullable = false)
    private Integer responseStatus;

    @Column(name = "response_body", columnDefinition = "JSON")
    private String responseBody;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;
}
