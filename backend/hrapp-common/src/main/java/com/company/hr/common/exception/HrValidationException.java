package com.company.hr.common.exception;

import java.util.Map;

/**
 * Thrown when input validation fails (field-level errors).
 * Maps to HTTP 400 Bad Request with a fieldErrors map.
 */
public class HrValidationException extends HrApplicationException {

    private final Map<String, String> fieldErrors;

    public HrValidationException(String message, Map<String, String> fieldErrors) {
        super(message, "VALIDATION_FAILED");
        this.fieldErrors = fieldErrors;
    }

    public HrValidationException(String field, String error) {
        super("Validation failed on field: " + field, "VALIDATION_FAILED");
        this.fieldErrors = Map.of(field, error);
    }

    public Map<String, String> getFieldErrors() {
        return fieldErrors;
    }
}
