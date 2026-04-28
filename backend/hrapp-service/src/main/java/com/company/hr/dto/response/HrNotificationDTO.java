package com.company.hr.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Notification row returned by the current-user notification APIs.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HrNotificationDTO {
    private Long id;
    private String type;
    private String title;
    private String message;
    private String referenceTable;
    private String referenceId;
    private boolean read;
    private Instant createdAt;
}
