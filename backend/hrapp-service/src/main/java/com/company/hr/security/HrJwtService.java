package com.company.hr.security;

import com.company.hr.config.HrJwtConfig;
import com.company.hr.common.log.HrLogHelper;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Service
public class HrJwtService {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrJwtService.class);

    private final HrJwtConfig jwtConfig;

    public HrJwtService(HrJwtConfig jwtConfig) {
        this.jwtConfig = jwtConfig;
    }

    public String generateToken(String username, List<String> roles, Integer employeeId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles);
        claims.put("employeeId", employeeId);
        return buildToken(claims, username, jwtConfig.getExpiration());
    }

    public String generateRefreshToken(String username) {
        return buildToken(new HashMap<>(), username, jwtConfig.getRefreshExpiration());
    }

    private String buildToken(Map<String, Object> extraClaims, String subject, long expiration) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(subject)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
        } catch (JwtException e) {
            LOGGER.warn("JWT validation failed: {}", e.getMessage());
            return false;
        }
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    @SuppressWarnings("unchecked")
    public List<String> extractRoles(String token) {
        return extractClaim(token, claims -> (List<String>) claims.get("roles"));
    }

    public Integer extractEmployeeId(String token) {
        return extractClaim(token, claims -> (Integer) claims.get("employeeId"));
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(
            java.util.Base64.getEncoder().encodeToString(jwtConfig.getSecret().getBytes())
        );
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
