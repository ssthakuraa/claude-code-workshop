package com.company.hr.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "hr.jwt")
public class HrJwtConfig {

    private String secret;
    private long expiration;           // milliseconds
    private long refreshExpiration;    // milliseconds

    public String getSecret() { return secret; }
    public void setSecret(String secret) { this.secret = secret; }

    public long getExpiration() { return expiration; }
    public void setExpiration(long expiration) { this.expiration = expiration; }

    public long getRefreshExpiration() { return refreshExpiration; }
    public void setRefreshExpiration(long refreshExpiration) { this.refreshExpiration = refreshExpiration; }
}
