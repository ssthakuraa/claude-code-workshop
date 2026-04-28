package com.company.hr.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Current-user preference payload returned by settings APIs.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HrUserPreferencesDTO {
    private String language;
    private String timezone;
    private String dateFormat;
    private String currency;
}
