package com.company.hr.common.exception;

/**
 * Thrown when a business rule is violated (e.g., salary outside job grade).
 * Maps to HTTP 422 Unprocessable Entity.
 */
public class HrBusinessRuleViolationException extends HrApplicationException {

    public HrBusinessRuleViolationException(String message, String errorCode) {
        super(message, errorCode);
    }

    public HrBusinessRuleViolationException(String message) {
        super(message, "BUSINESS_RULE_VIOLATION");
    }
}
