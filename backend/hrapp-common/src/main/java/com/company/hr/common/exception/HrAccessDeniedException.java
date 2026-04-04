package com.company.hr.common.exception;

/**
 * Thrown when a user attempts an action they are not authorized for.
 * Maps to HTTP 403 Forbidden.
 */
public class HrAccessDeniedException extends HrApplicationException {

    public HrAccessDeniedException(String message) {
        super(message, "ACCESS_DENIED");
    }

    public HrAccessDeniedException() {
        super("You do not have permission to perform this action.", "ACCESS_DENIED");
    }
}
