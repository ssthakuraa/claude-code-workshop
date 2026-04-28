package com.company.hr.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;
import java.util.Map;

/**
 * Standard API response envelope for all HR endpoints.
 *
 * Success:  { timestamp, status: 200, data: {...}, message: "..." }
 * Error:    { timestamp, status: 400, error: "...", errorCode: "...", fieldErrors: {...} }
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class HrApiResponse<T> {

    private Instant timestamp;
    private int status;
    private T data;
    private String message;

    // Error fields
    private String error;
    private String errorCode;
    private Map<String, String> fieldErrors;

    // Private constructor — use static factory methods
    private HrApiResponse() {
        this.timestamp = Instant.now();
    }

    // ---- Static factory methods ----

    public static <T> HrApiResponse<T> success(T data) {
        HrApiResponse<T> response = new HrApiResponse<>();
        response.status = 200;
        response.data = data;
        return response;
    }

    public static <T> HrApiResponse<T> success(T data, String message) {
        HrApiResponse<T> response = new HrApiResponse<>();
        response.status = 200;
        response.data = data;
        response.message = message;
        return response;
    }

    public static <T> HrApiResponse<T> created(T data, String message) {
        HrApiResponse<T> response = new HrApiResponse<>();
        response.status = 201;
        response.data = data;
        response.message = message;
        return response;
    }

    public static <T> HrApiResponse<T> error(int status, String error, String errorCode) {
        HrApiResponse<T> response = new HrApiResponse<>();
        response.status = status;
        response.error = error;
        response.errorCode = errorCode;
        return response;
    }

    public static <T> HrApiResponse<T> validationError(String error, Map<String, String> fieldErrors) {
        HrApiResponse<T> response = new HrApiResponse<>();
        response.status = 400;
        response.error = error;
        response.errorCode = "VALIDATION_FAILED";
        response.fieldErrors = fieldErrors;
        return response;
    }

    // ---- Getters ----

    public Instant getTimestamp() { return timestamp; }
    public int getStatus() { return status; }
    public T getData() { return data; }
    public String getMessage() { return message; }
    public String getError() { return error; }
    public String getErrorCode() { return errorCode; }
    public Map<String, String> getFieldErrors() { return fieldErrors; }
}
