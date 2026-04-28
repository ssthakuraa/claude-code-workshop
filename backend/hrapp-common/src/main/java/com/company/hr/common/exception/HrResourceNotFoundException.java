package com.company.hr.common.exception;

/**
 * Thrown when a requested resource does not exist.
 * Maps to HTTP 404 Not Found.
 */
public class HrResourceNotFoundException extends HrApplicationException {

    public HrResourceNotFoundException(String errorCode) {
        super(errorCode);
    }

    public HrResourceNotFoundException(String resourceType, Object id) {
        super("RESOURCE_NOT_FOUND");
    }
}
