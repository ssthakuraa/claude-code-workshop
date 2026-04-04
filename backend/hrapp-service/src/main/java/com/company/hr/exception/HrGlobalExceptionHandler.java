package com.company.hr.exception;

import com.company.hr.common.exception.*;
import com.company.hr.common.log.HrLogHelper;
import com.company.hr.common.response.HrApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class HrGlobalExceptionHandler {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrGlobalExceptionHandler.class);

    @ExceptionHandler(HrResourceNotFoundException.class)
    public ResponseEntity<HrApiResponse<Void>> handleNotFound(HrResourceNotFoundException ex) {
        LOGGER.warn("Resource not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(HrApiResponse.error(404, ex.getMessage(), ex.getErrorCode()));
    }

    @ExceptionHandler(HrConflictException.class)
    public ResponseEntity<HrApiResponse<Void>> handleConflict(HrConflictException ex) {
        LOGGER.warn("Conflict: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(HrApiResponse.error(409, ex.getMessage(), ex.getErrorCode()));
    }

    @ExceptionHandler(HrBusinessRuleViolationException.class)
    public ResponseEntity<HrApiResponse<Void>> handleBusinessRule(HrBusinessRuleViolationException ex) {
        LOGGER.warn("Business rule violation: {} (code={})", ex.getMessage(), ex.getErrorCode());
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(HrApiResponse.error(422, ex.getMessage(), ex.getErrorCode()));
    }

    @ExceptionHandler(HrValidationException.class)
    public ResponseEntity<HrApiResponse<Void>> handleValidation(HrValidationException ex) {
        LOGGER.warn("Validation failed: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(HrApiResponse.validationError(ex.getMessage(), ex.getFieldErrors()));
    }

    @ExceptionHandler(HrAccessDeniedException.class)
    public ResponseEntity<HrApiResponse<Void>> handleHrAccessDenied(HrAccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(HrApiResponse.error(403, ex.getMessage(), ex.getErrorCode()));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<HrApiResponse<Void>> handleSpringAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(HrApiResponse.error(403, "You do not have permission to perform this action.", "ACCESS_DENIED"));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<HrApiResponse<Void>> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(HrApiResponse.error(401, "Invalid username or password.", "INVALID_CREDENTIALS"));
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<HrApiResponse<Void>> handleDisabled(DisabledException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(HrApiResponse.error(401, "Your account has been disabled. Please contact HR.", "ACCOUNT_DISABLED"));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<HrApiResponse<Void>> handleBeanValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }
        LOGGER.warn("Bean validation failed: {} field errors", fieldErrors.size());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(HrApiResponse.validationError("Validation failed. Please check the highlighted fields.", fieldErrors));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<HrApiResponse<Void>> handleUnexpected(Exception ex) {
        LOGGER.error("Unexpected error: " + ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(HrApiResponse.error(500, "An unexpected error occurred. Please try again.", "INTERNAL_ERROR"));
    }
}
