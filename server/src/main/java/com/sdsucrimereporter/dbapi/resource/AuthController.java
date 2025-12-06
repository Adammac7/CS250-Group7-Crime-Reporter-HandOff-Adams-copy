package com.sdsucrimereporter.dbapi.resource;

import com.sdsucrimereporter.dbapi.dto.AuthResponse;
import com.sdsucrimereporter.dbapi.dto.LoginRequest;
import com.sdsucrimereporter.dbapi.dto.SignUpRequest;
import com.sdsucrimereporter.dbapi.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth") // again still local http://localhost:8080/api/auth
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // POST REGISTER USER /auth/signup
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signUp(@RequestBody SignUpRequest request) {
        try {
            AuthResponse response = authService.registerUser(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // POST LOGIN USER /auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.loginUser(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).build();
        }
    }
}
