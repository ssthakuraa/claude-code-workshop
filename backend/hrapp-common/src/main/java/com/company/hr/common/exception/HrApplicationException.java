package com.company.hr.common.exception;

/**
 * Base exception for all HR application exceptions.
 * Subclasses map to specific HTTP status codes via HrGlobalExceptionHandler.
 */
public class HrApplicationException extends RuntimeException {

    private final String errorCode;

    public HrApplicationException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public HrApplicationException(String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
