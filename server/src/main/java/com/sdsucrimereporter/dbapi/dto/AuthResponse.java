package com.sdsucrimereporter.dbapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String redID;
    private String firstName;
    private String lastName;
    private String email;

}
