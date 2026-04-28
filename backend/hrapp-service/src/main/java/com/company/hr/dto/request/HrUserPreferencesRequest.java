package com.company.hr.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * API shape used by the settings page. Values are normalized for the UI rather than exposing raw DB formats.
 */
@Data
@NoArgsConstructor
public class HrUserPreferencesRequest {
    private String language;
    private String timezone;
    private String dateFormat;
    private String currency;
}
