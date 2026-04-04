-- V4: Idempotency Keys Table
-- Used to prevent duplicate hire/terminate/promote/transfer operations

CREATE TABLE hr_idempotency_keys (
    idempotency_key VARCHAR(64) NOT NULL,
    endpoint VARCHAR(100) NOT NULL,
    response_status INT NOT NULL,
    response_body JSON,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    PRIMARY KEY (idempotency_key)
);

CREATE INDEX idx_idempotency_expires ON hr_idempotency_keys(expires_at);
