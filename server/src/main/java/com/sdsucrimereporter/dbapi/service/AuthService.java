package com.sdsucrimereporter.dbapi.service;

import com.sdsucrimereporter.dbapi.domain.Reporter;
import com.sdsucrimereporter.dbapi.dto.AuthResponse;
import com.sdsucrimereporter.dbapi.dto.LoginRequest;
import com.sdsucrimereporter.dbapi.dto.SignUpRequest;
import com.sdsucrimereporter.dbapi.repo.ReporterRepo;
import com.sdsucrimereporter.dbapi.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final ReporterRepo reporterRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    // ===== SIGN UP =====
    public AuthResponse registerUser(SignUpRequest request) {

        // CHECK SDSU EMAIL FORMAT
        if (!request.getSdsuEmail().endsWith("@sdsu.edu")) {
            throw new RuntimeException("You must use a SDSU email: (@sdsu.edu)");
        }

        // CHECK IF RED ID ALREADY EXISTS
        String redID = request.getRedID();
        if (reporterRepo.existsByRedID(redID)) {
            throw new RuntimeException("Red ID already registered");
        }

        // CHECK IF EMAIL ALREADY EXISTS
        if (reporterRepo.existsBySdsuEmail(request.getSdsuEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // CREATE NEW REPORTER OBJECTT
        Reporter reporter = new Reporter();
        reporter.setFirstName(request.getFirstName());
        reporter.setLastName(request.getLastName());
        reporter.setSdsuEmail(request.getSdsuEmail());
        reporter.setRedID(redID);

        // ENCRYPT PASSWORD
        String encryptedPassword = passwordEncoder.encode(request.getPassword());
        reporter.setPassword(encryptedPassword);

        // STORE IN DATABASE
        reporterRepo.save(reporter);

        // GENERATE JWT TOKEN
        String token = tokenProvider.generateToken(reporter.getRedID());

        // RETURN REGISTER RESPONSE WITH JWT TOKEN
        return new AuthResponse(
                token,
                reporter.getRedID(),
                reporter.getFirstName(),
                reporter.getLastName(),
                reporter.getSdsuEmail());
    }

    // ===== LOGIN =====
    public AuthResponse loginUser(LoginRequest request) {

        // FIND USER BY RED ID IF STORED IN DATABASE
        Reporter reporter = reporterRepo.findByRedID(request.getRedID())
                .orElseThrow(() -> new RuntimeException("Invalid Credentials"));

        // COMPARE USER INPUT PASSWORRD WITH ENCRYPTED PASSWORD FROM DATABASE
        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), reporter.getPassword());

        if (!passwordMatches) {
            throw new RuntimeException("Invalid Credentials");
        }

        // GENERATE NEW TOKEN
        String token = tokenProvider.generateToken(reporter.getRedID());

        // RETURN LOGIN RESPONSE WITH JWT TOKEN
        return new AuthResponse(
                token,
                reporter.getRedID(),
                reporter.getFirstName(),
                reporter.getLastName(),
                reporter.getSdsuEmail());
    }

}
