package com.project.codebasespringjpa.service.interfaces;

import com.project.codebasespringjpa.dto.authen.request.LoginRequest;
import com.project.codebasespringjpa.dto.authen.response.LoginResponse;

public interface IAuthenService {
    LoginResponse login(LoginRequest request);
}
