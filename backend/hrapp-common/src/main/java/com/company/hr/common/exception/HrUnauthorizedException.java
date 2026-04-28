package com.company.hr.common.exception;

/**
 * Thrown when authentication fails or a caller presents invalid credentials.
 * Maps to HTTP 401 Unauthorized.
 */
public class HrUnauthorizedException extends HrApplicationException {

    public HrUnauthorizedException(String errorCode) {
        super(errorCode);
    }

    public HrUnauthorizedException(String message, String errorCode) {
        super(message, errorCode);
    }
}
