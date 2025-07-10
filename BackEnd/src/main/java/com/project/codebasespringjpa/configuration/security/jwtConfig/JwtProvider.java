package com.project.codebasespringjpa.configuration.security.jwtConfig;

import com.project.codebasespringjpa.configuration.security.UserDetailsImpl;
import com.project.codebasespringjpa.entity.UserEntity;
import com.project.codebasespringjpa.repository.IUserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.util.Date;

@Component
public class JwtProvider {
    @Value("${jwt.SECRET_KEY}")
    private String JWT_SECRET;
    @Value("${jwt.JWT_EXPIRATION}")
    private int JWT_EXPIRATION;
    @Autowired
    IUserRepository userRepository;

    public String generateToken(UserDetailsImpl customDetailService) {
        return this.generateTokenByUsername(customDetailService.getUsername());
    }

    public String generateTokenByUsername(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION);
        UserEntity userEntity = userRepository.findByUsername(username).get();

        String roleName = userEntity.getRole().getName();
        // Thêm prefix ROLE_ nếu chưa có
        if (!roleName.startsWith("ROLE_")) {
            roleName = "ROLE_" + roleName;
        }

        return Jwts.builder()
                .setSubject(Long.toString(userEntity.getId()))
                .claim("username", userEntity.getUsername())
                .claim("role", roleName) // Lưu "ROLE_ADMIN" thay vì "ADMIN"
                .setExpiration(expiryDate)
                .setIssuedAt(new Date())
                .signWith(SignatureAlgorithm.HS512, JWT_SECRET)
                .compact();
    }

    public Long getUserIdFromJWT(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(JWT_SECRET)
                .parseClaimsJws(token)
                .getBody();
        return Long.parseLong(claims.getSubject());
    }

    public String getKeyByValueFromJWT(String key, String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(JWT_SECRET)
                .parseClaimsJws(token)
                .getBody();
        return claims.get(key, String.class);
    }
}
