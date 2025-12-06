package com.sdsucrimereporter.dbapi.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    // Get the secret key we created in application.yml
    @Value("${app.jwt.secret}")
    private String jwtSecret;

    // Get expiration time we created in application.yml
    @Value("${app.jwt.expiration}")
    private long jwtExpirationMs;

    // Create signing key from secret in .yml
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    // CREATE TOKEN!
    public String generateToken(String redID) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        // BUILD TOKEN
        return Jwts.builder()
                .setSubject(redID) // TOKEN FOR SDSU STUDENTS
                .setIssuedAt(now)
                .setExpiration(expiryDate) // EXPIRES IN 24HRS/86400000 Ms
                // THIS IS OUR HASHING FUNCTION
                .signWith(getSigningKey(), SignatureAlgorithm.HS512) // Correlates to secret in App.yml
                .compact();
    }

    // GET USER FROM TOKEN
    public String getRedIDFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject(); // RETURN redID
    }

    // VALIDATE TOKEN
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true; // IF ALL GOOD RETURN TRUE
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

} // END OF JwtATokenProvier Class
