package com.company.hr.model;

import com.company.hr.common.audit.HrAuditListener;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "employees")
@EntityListeners(HrAuditListener.class)
@SQLRestriction("deleted_at IS NULL")
@Getter @Setter @NoArgsConstructor
public class HrEmployee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_id")
    private Integer employeeId;

    @Column(name = "first_name", length = 20)
    private String firstName;

    @Column(name = "last_name", length = 25, nullable = false)
    private String lastName;

    @Column(name = "email", length = 100, nullable = false, unique = true)
    private String email;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "hire_date", nullable = false)
    private LocalDate hireDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private HrJob job;

    @Column(name = "salary", precision = 8, scale = 2)
    private BigDecimal salary;

    @Column(name = "commission_pct", precision = 2, scale = 2)
    private BigDecimal commissionPct;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private HrEmployee manager;

    @OneToMany(mappedBy = "manager", fetch = FetchType.LAZY)
    private List<HrEmployee> directReports = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private HrDepartment department;

    @Enumerated(EnumType.STRING)
    @Column(name = "employment_status", length = 20, nullable = false)
    private EmploymentStatus employmentStatus = EmploymentStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(name = "employment_type", length = 20, nullable = false)
    private EmploymentType employmentType = EmploymentType.FULL_TIME;

    @Column(name = "contract_end_date")
    private LocalDate contractEndDate;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<HrJobHistory> jobHistory = new ArrayList<>();

    public boolean isDeleted() { return deletedAt != null; }

    public enum EmploymentStatus {
        ACTIVE, ON_LEAVE, TERMINATED, PROBATION
    }

    public enum EmploymentType {
        FULL_TIME, PART_TIME, CONTRACT, INTERN
    }
}
