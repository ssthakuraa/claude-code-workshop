package com.company.hr.common.exception;

/**
 * Thrown when a requested resource does not exist.
 * Maps to HTTP 404 Not Found.
 */
public class HrResourceNotFoundException extends HrApplicationException {

    public HrResourceNotFoundException(String message) {
        super(message, "RESOURCE_NOT_FOUND");
    }

    public HrResourceNotFoundException(String resourceType, Object id) {
        super(resourceType + " with id " + id + " not found", "RESOURCE_NOT_FOUND");
    }
}
