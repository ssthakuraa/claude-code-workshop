package com.company.hr.security;

import com.company.hr.common.log.HrLogHelper;
import org.mindrot.jbcrypt.BCrypt;

/**
 * BCrypt wrapper used by the Jersey runtime without relying on legacy crypto wiring.
*/
public final class HrPasswordHasher {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrPasswordHasher.class);

    private HrPasswordHasher() {
    }

    public static String hash(String rawPassword) {
        return BCrypt.hashpw(rawPassword, BCrypt.gensalt());
    }

    public static boolean matches(String rawPassword, String storedHash) {
        if (rawPassword == null || storedHash == null || storedHash.isBlank()) {
            return false;
        }
        try {
            return BCrypt.checkpw(rawPassword, storedHash);
        } catch (IllegalArgumentException ex) {
            LOGGER.warn("Rejected malformed password hash");
            return false;
        }
    }
}
