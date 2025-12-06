package com.sdsucrimereporter.dbapi.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;

    // THIS WILL RUN ONE TIME FOR EACH HTTP REQUEST
    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        try {
            // GET TOKEN
            String jwt = getJwtFromRequest(request);

            // CHECK IF TOKEN EXISTS & VALID
            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                // GET USER FROM TOKEN
                String redID = tokenProvider.getRedIDFromToken(jwt);

                // CREATE AUTHENTICATION OBJECT
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(redID,
                        null, new ArrayList<>());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // TELL SPRING SECURITY THIS USER IS AUTHENTICATED
                SecurityContextHolder.getContext().setAuthentication(authentication);

            }
        } catch (Exception ex) {
            logger.error("User count not be authenticated.", ex);
        }

        // CONTINUE WITH HTTP AUTH REQUEST
        filterChain.doFilter(request, response);

    }

    // HELPER METHOD - Extract JWT from "Authorization: Bearer <token>" header
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // REMOVE "Bearer " from prefix of JWT Token Structure
        }
        return null;
    }

}
