package com.company.hr.repository;

import com.company.hr.model.HrAuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HrAuditLogRepository extends JpaRepository<HrAuditLog, Long> {

    Page<HrAuditLog> findAllByOrderByChangedAtDesc(Pageable pageable);

    Page<HrAuditLog> findByTableNameOrderByChangedAtDesc(String tableName, Pageable pageable);
}
