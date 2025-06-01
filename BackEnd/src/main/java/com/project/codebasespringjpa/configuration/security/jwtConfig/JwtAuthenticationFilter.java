package com.project.codebasespringjpa.configuration.security.jwtConfig;

import com.project.codebasespringjpa.configuration.security.UserDetailsImpl;
import com.project.codebasespringjpa.repository.IUserRepository;
import com.project.codebasespringjpa.service.interfaces.IUserService;
import io.jsonwebtoken.*;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    JwtProvider jwtProvider;
    @Autowired
    IUserService userService;
    @Autowired
    IUserRepository userRepository;
    @Value("${jwt.SECRET_KEY}")
    private String JWT_SECRET;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try{
            String jwtToken = getJwtFromRequest(request);
            if(jwtToken != null && this.validateToken(jwtToken)){
                String username = jwtProvider.getKeyByValueFromJWT("username", jwtToken);
                UserDetailsImpl userDetails = (UserDetailsImpl) userService.loadUserByUsername(username);
                if(userDetails != null) {
                    UsernamePasswordAuthenticationToken
                            authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);

                }
            }
        }
        catch (Exception e){
            logger.error("err when filter internal: " + e.getMessage());
        }
        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request){
        String token = request.getHeader("Authorization");
        if(StringUtils.hasText(token) && token.startsWith("Bearer ")){
            return token.substring(7);
        }
        return null;
    }

    public boolean validateToken(String authToken){
        try{
            Jwts.parser().setSigningKey(JWT_SECRET).parseClaimsJws(authToken);
            return true;
        }
        catch (SignatureException e){
            logger.error("Invalid JWT signature: "+ e.getMessage());
        }
        catch (MalformedJwtException e){
            logger.error("Invalid JWT token: "+ e.getMessage());
        }
        catch (ExpiredJwtException e){
            logger.error("JWT token is expired: "+ e.getMessage());
        }
        catch (UnsupportedJwtException e){
            logger.error("JWT token unsupported: "+ e.getMessage());
        }
        catch (IllegalArgumentException e){
            logger.error("JWT claims string is empty: "+ e.getMessage());
        }
        return false;
    }
}
