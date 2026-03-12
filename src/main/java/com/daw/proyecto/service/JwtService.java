package com.daw.proyecto.service;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


import java.util.Date;

import javax.crypto.SecretKey;

@Service
public class JwtService {

    @Value("${jwt.secret:tu_clave_secreta_muy_segura_cambiar_en_produccion}")
    private String secretKey;

    @Value("${jwt.expiration:86400000}")
    private long expirationTime;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    // Generar token JWT
    public String generateToken(Integer userId, String email) {
        return Jwts.builder()
                .setSubject(email)
                .claim("id", userId)
                .claim("email", email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSigningKey())
                .compact();
    }

    // Validar y extraer claims del token
    public Claims validateToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Extraer email del token
    public String getEmailFromToken(String token) {
        return validateToken(token).getSubject();
    }

    // Extraer ID del token
    public Integer getUserIdFromToken(String token) {
        return validateToken(token).get("id", Integer.class);
    }
}
