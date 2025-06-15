package com.project.codebasespringjpa.service.interfaces;

import com.project.codebasespringjpa.dto.authen.request.LoginRequest;
import com.project.codebasespringjpa.dto.authen.request.RegisterRequest;
import com.project.codebasespringjpa.dto.authen.response.LoginResponse;

public interface IAuthenService {
    boolean register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
}
