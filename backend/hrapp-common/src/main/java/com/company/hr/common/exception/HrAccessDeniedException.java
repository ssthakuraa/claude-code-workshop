package com.company.hr.common.exception;

/**
 * Thrown when a user attempts an action they are not authorized for.
 * Maps to HTTP 403 Forbidden.
 */
public class HrAccessDeniedException extends HrApplicationException {

    public HrAccessDeniedException(String errorCode) {
        super(errorCode);
    }

    public HrAccessDeniedException() {
        super("ACCESS_DENIED");
    }
}
