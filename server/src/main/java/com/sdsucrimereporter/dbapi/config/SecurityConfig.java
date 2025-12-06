package com.sdsucrimereporter.dbapi.config;

import com.sdsucrimereporter.dbapi.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // DISABLE SPRING CSRF TOKENS
        http
                .csrf(csrf -> csrf.disable())
                // SET STATELESS REQUESTS
                .sessionManagement(session -> session.sessionCreationPolicy((SessionCreationPolicy.STATELESS)))
                // AUTHORIZATION RULES: WHO CAN DO WHAT OPERATIONS
                .authorizeHttpRequests(auth -> auth
                        // PUBLIC OPS
                        .requestMatchers("api/auth/**").permitAll() // SIGNUP & LOGIN
                        .requestMatchers("api/reports").permitAll() // GET ALL REPORTS
                        .requestMatchers("api/reports/{id}").permitAll() // GET A REPORT
                        .requestMatchers("api/reports/image/**").permitAll() // GET REPORT IMAGES

                        // PRIVATE OPS -- NEED TO USE AUTHENTICATION TOKENS
                        .anyRequest().authenticated());

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // PASSWORD ENCODER -- ONE-WAY ENCRYPTION
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // AUTH MANAGER
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
