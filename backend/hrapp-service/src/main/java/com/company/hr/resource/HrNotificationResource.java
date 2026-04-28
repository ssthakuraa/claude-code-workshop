package com.company.hr.resource;

import com.company.hr.common.exception.HrApplicationException;
import com.company.hr.common.exception.HrResourceNotFoundException;
import com.company.hr.common.exception.HrUnauthorizedException;
import com.company.hr.common.log.HrLogHelper;
import com.company.hr.common.response.HrApiResponse;
import com.company.hr.common.security.HrSecurityUtil;
import com.company.hr.dto.response.HrNotificationDTO;
import com.company.hr.repository.HrNotificationJdbcRepository;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

/**
 * Exposes current-user notification queries and acknowledge actions for the Jersey runtime.
 */
@Path("/notifications")
@Produces(MediaType.APPLICATION_JSON)
public class HrNotificationResource {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrNotificationResource.class);
    private final HrNotificationJdbcRepository repository;

    public HrNotificationResource() {
        this(new HrNotificationJdbcRepository());
    }

    HrNotificationResource(HrNotificationJdbcRepository repository) {
        this.repository = repository;
    }

    @GET
    public HrApiResponse<List<HrNotificationDTO>> findMine() {
        String username = requireCurrentUsername();
        try {
            return HrApiResponse.success(repository.findForUsername(username));
        } catch (IllegalStateException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    @POST
    @Path("/{id}/read")
    public HrApiResponse<List<HrNotificationDTO>> markRead(@PathParam("id") long id) {
        String username = requireCurrentUsername();
        try {
            boolean updated = repository.markRead(username, id);
            if (!updated) {
                throw new HrResourceNotFoundException("Notification", id);
            }
            LOGGER.info("Notification marked as read for notificationId={}", id);
            return HrApiResponse.success(repository.findForUsername(username));
        } catch (HrResourceNotFoundException ex) {
            throw ex;
        } catch (IllegalStateException ex) {
            LOGGER.error("Failed to update notificationId={}", id, ex);
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    @POST
    @Path("/read-all")
    public HrApiResponse<List<HrNotificationDTO>> markAllRead() {
        String username = requireCurrentUsername();
        try {
            repository.markAllRead(username);
            LOGGER.info("All notifications marked as read");
            return HrApiResponse.success(repository.findForUsername(username));
        } catch (IllegalStateException ex) {
            LOGGER.error("Failed to mark all notifications as read", ex);
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    private String requireCurrentUsername() {
        String username = HrSecurityUtil.getCurrentUsername();
        if (username == null || username.isBlank()) {
            throw new HrUnauthorizedException("UNAUTHORIZED");
        }
        return username;
    }
}
