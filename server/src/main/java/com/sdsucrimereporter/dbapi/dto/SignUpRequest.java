package com.sdsucrimereporter.dbapi.dto;

import lombok.Data;

@Data
public class SignUpRequest {
    private String firstName;
    private String lastName;
    private String sdsuEmail;
    private String redID;
    private String password;
}
