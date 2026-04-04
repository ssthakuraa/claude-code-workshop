package com.company.hr.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;

@Embeddable
@Data @NoArgsConstructor @AllArgsConstructor
public class HrJobHistoryId implements Serializable {

    @Column(name = "employee_id")
    private Integer employeeId;

    @Column(name = "start_date")
    private LocalDate startDate;
}
