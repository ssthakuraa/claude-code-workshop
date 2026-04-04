package com.company.hr.common.audit;

import com.company.hr.common.log.HrLogHelper;
import com.company.hr.common.security.HrSecurityUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PostUpdate;
import jakarta.persistence.PreUpdate;

import java.util.HashMap;
import java.util.Map;

/**
 * JPA Entity Listener that captures audit events for any entity annotated with
 * {@code @EntityListeners(HrAuditListener.class)}.
 *
 * The actual persistence of audit records is delegated to HrAuditService
 * (in hrapp-service) via a Spring-managed bean injected through a static holder.
 * This avoids a circular dependency between hrapp-common and hrapp-service.
 *
 * Usage on entity:
 *   @Entity
 *   @EntityListeners(HrAuditListener.class)
 *   public class HrEmployee { ... }
 */
public class HrAuditListener {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrAuditListener.class);

    // Static holder for the audit callback — set during application startup
    private static AuditEventPublisher auditPublisher;

    public static void setAuditPublisher(AuditEventPublisher publisher) {
        auditPublisher = publisher;
    }

    @PostPersist
    public void onPostPersist(Object entity) {
        publishAuditEvent(entity, "INSERT", null, serializeEntity(entity));
    }

    @PreUpdate
    public void onPreUpdate(Object entity) {
        // Store old state in thread-local before update is applied
        HrAuditContext.setOldState(serializeEntity(entity));
    }

    @PostUpdate
    public void onPostUpdate(Object entity) {
        String oldState = HrAuditContext.getOldState();
        HrAuditContext.clearOldState();
        publishAuditEvent(entity, "UPDATE", oldState, serializeEntity(entity));
    }

    private void publishAuditEvent(Object entity, String action, String oldValues, String newValues) {
        if (auditPublisher == null) {
            LOGGER.debug("AuditPublisher not set — skipping audit for {} action={}", entityName(entity), action);
            return;
        }
        try {
            AuditEvent event = new AuditEvent(
                    entityName(entity),
                    extractEntityId(entity),
                    action,
                    HrSecurityUtil.getCurrentUsername(),
                    oldValues,
                    newValues
            );
            auditPublisher.publish(event);
        } catch (Exception e) {
            LOGGER.error("Failed to publish audit event for entity={} action={}", entity.getClass().getSimpleName(), action);
        }
    }

    private String entityName(Object entity) {
        return entity.getClass().getSimpleName();
    }

    private String extractEntityId(Object entity) {
        try {
            var idField = entity.getClass().getDeclaredField("id");
            idField.setAccessible(true);
            Object id = idField.get(entity);
            return id != null ? id.toString() : "unknown";
        } catch (Exception e) {
            // Try common id field names
            for (String fieldName : new String[]{"employeeId", "departmentId", "jobId", "userId"}) {
                try {
                    var f = entity.getClass().getDeclaredField(fieldName);
                    f.setAccessible(true);
                    Object id = f.get(entity);
                    if (id != null) return id.toString();
                } catch (Exception ignored) {}
            }
            return "unknown";
        }
    }

    private String serializeEntity(Object entity) {
        try {
            return new ObjectMapper().writeValueAsString(entity);
        } catch (JsonProcessingException e) {
            return "{}";
        }
    }

    /**
     * Callback interface — implemented by HrAuditService in hrapp-service.
     */
    public interface AuditEventPublisher {
        void publish(AuditEvent event);
    }

    /**
     * Audit event data transfer object.
     */
    public record AuditEvent(
            String entityType,
            String entityId,
            String action,
            String changedBy,
            String oldValues,
            String newValues
    ) {}

    /**
     * Thread-local storage for pre-update entity state.
     */
    private static class HrAuditContext {
        private static final ThreadLocal<String> OLD_STATE = new ThreadLocal<>();

        static void setOldState(String state) { OLD_STATE.set(state); }
        static String getOldState() { return OLD_STATE.get(); }
        static void clearOldState() { OLD_STATE.remove(); }
    }
}
