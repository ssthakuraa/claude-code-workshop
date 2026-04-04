package com.company.hr.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "hr_audit_logs")
@Getter @Setter @NoArgsConstructor
public class HrAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "audit_id")
    private Long auditId;

    @Column(name = "table_name", length = 60, nullable = false)
    private String tableName;

    @Column(name = "record_id", length = 60, nullable = false)
    private String recordId;

    @Enumerated(EnumType.STRING)
    @Column(name = "action", nullable = false)
    private AuditAction action;

    @Column(name = "old_value", columnDefinition = "JSON")
    private String oldValue;

    @Column(name = "new_value", columnDefinition = "JSON")
    private String newValue;

    @Column(name = "changed_by")
    private Integer changedBy;

    @Column(name = "changed_at", nullable = false, updatable = false)
    private Instant changedAt = Instant.now();

    public enum AuditAction {
        INSERT, UPDATE, DELETE
    }
}
