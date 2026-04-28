package com.company.hr.exception;

import com.company.hr.common.exception.HrAccessDeniedException;
import com.company.hr.common.exception.HrApplicationException;
import com.company.hr.common.exception.HrConflictException;
import com.company.hr.common.exception.HrResourceNotFoundException;
import com.company.hr.common.exception.HrUnauthorizedException;
import com.company.hr.common.exception.HrValidationException;
import com.company.hr.common.i18n.HrMessageSource;
import com.company.hr.common.log.HrLogHelper;
import com.company.hr.common.response.HrApiResponse;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.NotAllowedException;
import jakarta.ws.rs.NotAuthorizedException;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

/**
 * Jersey exception mapper for the rewrite runtime.
 */
@Provider
public class HrApplicationExceptionMapper implements ExceptionMapper<Throwable> {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrApplicationExceptionMapper.class);

    @Override
    public Response toResponse(Throwable exception) {
        if (exception instanceof HrValidationException validationException) {
            LOGGER.warn("Validation failed: {}", validationException.getErrorCode());
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(HrApiResponse.validationError(
                            resolveErrorMessage(Response.Status.BAD_REQUEST, validationException),
                            validationException.getFieldErrors()))
                    .build();
        }

        if (exception instanceof HrUnauthorizedException unauthorizedException) {
            LOGGER.warn("Authentication failed: {}", unauthorizedException.getErrorCode());
            return error(Response.Status.UNAUTHORIZED, unauthorizedException);
        }

        if (exception instanceof HrAccessDeniedException accessDeniedException) {
            LOGGER.warn("Access denied: {}", accessDeniedException.getErrorCode());
            return error(Response.Status.FORBIDDEN, accessDeniedException);
        }

        if (exception instanceof HrResourceNotFoundException notFoundException) {
            LOGGER.warn("Resource not found: {}", notFoundException.getErrorCode());
            return error(Response.Status.NOT_FOUND, notFoundException);
        }

        if (exception instanceof HrConflictException conflictException) {
            LOGGER.warn("Conflict: {}", conflictException.getErrorCode());
            return error(Response.Status.CONFLICT, conflictException);
        }

        if (exception instanceof HrApplicationException applicationException) {
            LOGGER.warn("Application error: {}", applicationException.getErrorCode());
            return error(Response.Status.INTERNAL_SERVER_ERROR, applicationException);
        }

        if (exception instanceof WebApplicationException webApplicationException) {
            return mapWebApplicationException(webApplicationException);
        }

        LOGGER.error("Unexpected Jersey error: " + exception.getMessage(), exception);
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(HrApiResponse.error(500,
                        HrMessageSource.get("hr.error.unexpected"),
                        "INTERNAL_ERROR"))
                .build();
    }

    private Response error(Response.Status status, HrApplicationException exception) {
        return Response.status(status)
                .entity(HrApiResponse.error(
                        status.getStatusCode(),
                        resolveErrorMessage(status, exception),
                        exception.getErrorCode()))
                .build();
    }

    private String resolveErrorMessage(Response.Status status, HrApplicationException exception) {
        String localized = localizedMessageForCode(exception.getErrorCode());
        if (localized != null) {
            return localized;
        }

        String message = exception.getMessage();
        if (message != null && !message.isBlank() && !message.equals(exception.getErrorCode())) {
            return message;
        }

        return defaultMessageForStatus(status.getStatusCode());
    }

    private String localizedMessageForCode(String errorCode) {
        String key = switch (errorCode) {
            case "AUTH_REQUIRED", "UNAUTHORIZED" -> "hr.error.auth.required";
            case "INVALID_CREDENTIALS" -> "hr.auth.invalid.credentials";
            case "REFRESH_TOKEN_INVALID" -> "hr.auth.refresh.invalid";
            case "ACCOUNT_DISABLED" -> "hr.auth.account.disabled";
            case "ACCESS_DENIED" -> "hr.error.access.denied";
            case "RESOURCE_NOT_FOUND" -> "hr.error.not.found";
            case "CONFLICT" -> "hr.error.conflict";
            case "DB_ACCESS_ERROR" -> "hr.error.db.access";
            case "INTERNAL_ERROR" -> "hr.error.unexpected";
            case "VALIDATION_FAILED" -> "hr.error.validation";
            case "BAD_REQUEST" -> "hr.error.bad.request";
            case "METHOD_NOT_ALLOWED" -> "hr.error.method.not.allowed";
            case "EMAIL_EXISTS" -> "hr.error.email.exists";
            case "EMPLOYEE_ALREADY_TERMINATED" -> "hr.error.employee.already.terminated";
            case "SALARY_BELOW_MINIMUM" -> "hr.error.salary.below.minimum";
            case "SALARY_ABOVE_MAXIMUM" -> "hr.error.salary.above.maximum";
            case "DUPLICATE_REQUEST" -> "hr.error.duplicate.request";
            case "BUSINESS_RULE_VIOLATION" -> "hr.error.business.rule";
            default -> null;
        };

        if (key == null) {
            return null;
        }

        String resolved = HrMessageSource.get(key);
        return resolved.equals(key) ? null : resolved;
    }

    private Response mapWebApplicationException(WebApplicationException exception) {
        Response.StatusType statusType = exception.getResponse().getStatusInfo();
        int status = statusType.getStatusCode();
        String message = defaultMessage(exception);
        String errorCode = defaultErrorCode(status);

        if (status >= 500) {
            LOGGER.error("Web application error: {}", message, exception);
        } else {
            LOGGER.warn("Web application error: {}", message);
        }

        return Response.status(status)
                .entity(HrApiResponse.error(status, message, errorCode))
                .build();
    }

    private String defaultMessage(WebApplicationException exception) {
        if (exception instanceof NotAuthorizedException) {
            return defaultMessageForStatus(401);
        }
        if (exception instanceof ForbiddenException) {
            return defaultMessageForStatus(403);
        }
        if (exception instanceof NotFoundException) {
            return defaultMessageForStatus(404);
        }
        if (exception instanceof NotAllowedException) {
            return defaultMessageForStatus(405);
        }
        if (exception instanceof BadRequestException) {
            return defaultMessageForStatus(400);
        }
        return defaultMessageForStatus(exception.getResponse().getStatus());
    }

    private String defaultMessageForStatus(int status) {
        return switch (status) {
            case 400 -> HrMessageSource.get("hr.error.bad.request");
            case 401 -> HrMessageSource.get("hr.error.auth.required");
            case 403 -> HrMessageSource.get("hr.error.access.denied");
            case 404 -> HrMessageSource.get("hr.error.not.found");
            case 405 -> HrMessageSource.get("hr.error.method.not.allowed");
            default -> HrMessageSource.get("hr.error.request.failed");
        };
    }

    private String defaultErrorCode(int status) {
        return switch (status) {
            case 400 -> "BAD_REQUEST";
            case 401 -> "UNAUTHORIZED";
            case 403 -> "ACCESS_DENIED";
            case 404 -> "RESOURCE_NOT_FOUND";
            case 405 -> "METHOD_NOT_ALLOWED";
            default -> "INTERNAL_ERROR";
        };
    }
}
