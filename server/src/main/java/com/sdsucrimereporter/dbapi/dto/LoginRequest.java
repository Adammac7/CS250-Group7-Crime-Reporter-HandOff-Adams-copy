package com.sdsucrimereporter.dbapi.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String redID;
    private String password;
}
