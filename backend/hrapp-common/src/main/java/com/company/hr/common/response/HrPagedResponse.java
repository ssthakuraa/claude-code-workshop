package com.company.hr.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;
import java.util.List;
import java.util.Map;

/**
 * Paged response envelope for list endpoints.
 *
 * Example:
 * {
 *   "timestamp": "...",
 *   "status": 200,
 *   "data": [...],
 *   "totalElements": 157,
 *   "totalPages": 16,
 *   "currentPage": 0,
 *   "pageSize": 10
 * }
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class HrPagedResponse<T> {

    private Instant timestamp;
    private int status;
    private List<T> data;
    private String message;

    // Pagination metadata
    private long totalElements;
    private int totalPages;
    private int currentPage;
    private int pageSize;

    // Error fields
    private String error;
    private String errorCode;
    private Map<String, String> fieldErrors;

    private HrPagedResponse() {
        this.timestamp = Instant.now();
    }

    public static <T> HrPagedResponse<T> of(List<T> data, long totalElements, int totalPages,
                                             int currentPage, int pageSize) {
        HrPagedResponse<T> response = new HrPagedResponse<>();
        response.status = 200;
        response.data = data;
        response.totalElements = totalElements;
        response.totalPages = totalPages;
        response.currentPage = currentPage;
        response.pageSize = pageSize;
        return response;
    }

    // ---- Getters ----

    public Instant getTimestamp() { return timestamp; }
    public int getStatus() { return status; }
    public List<T> getData() { return data; }
    public String getMessage() { return message; }
    public long getTotalElements() { return totalElements; }
    public int getTotalPages() { return totalPages; }
    public int getCurrentPage() { return currentPage; }
    public int getPageSize() { return pageSize; }
    public String getError() { return error; }
    public String getErrorCode() { return errorCode; }
    public Map<String, String> getFieldErrors() { return fieldErrors; }
}
