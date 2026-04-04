package com.company.hr.model;

import com.company.hr.common.audit.HrAuditListener;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLRestriction;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "departments")
@EntityListeners(HrAuditListener.class)
@SQLRestriction("deleted_at IS NULL")
@Getter @Setter @NoArgsConstructor
public class HrDepartment {

    @Id
    @Column(name = "department_id")
    private Integer departmentId;

    @Column(name = "department_name", length = 30, nullable = false)
    private String departmentName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private HrEmployee manager;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id")
    private HrLocation location;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_department_id")
    private HrDepartment parentDepartment;

    @OneToMany(mappedBy = "parentDepartment", fetch = FetchType.LAZY)
    private List<HrDepartment> children = new ArrayList<>();

    @Column(name = "deleted_at")
    private Instant deletedAt;

    public boolean isDeleted() {
        return deletedAt != null;
    }
}
