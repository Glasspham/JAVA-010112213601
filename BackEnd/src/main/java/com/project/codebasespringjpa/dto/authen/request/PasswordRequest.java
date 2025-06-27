package com.project.codebasespringjpa.dto.authen.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PasswordRequest {
    String oldpassword;
    String newpassword;
}
