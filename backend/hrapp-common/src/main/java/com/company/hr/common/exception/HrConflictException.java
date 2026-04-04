package com.company.hr.common.exception;

/**
 * Thrown when a resource already exists (duplicate key, email, etc.).
 * Maps to HTTP 409 Conflict.
 */
public class HrConflictException extends HrApplicationException {

    public HrConflictException(String message) {
        super(message, "CONFLICT");
    }

    public HrConflictException(String message, String errorCode) {
        super(message, errorCode);
    }
}
