package com.project.codebasespringjpa.controller;

import com.project.codebasespringjpa.dto.authen.request.LoginRequest;
import com.project.codebasespringjpa.dto.authen.request.RegisterRequest;
import com.project.codebasespringjpa.dto.authen.response.LoginResponse;
import com.project.codebasespringjpa.exception.ApiResponse;
import com.project.codebasespringjpa.service.interfaces.IAuthenService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE)
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private IAuthenService authenService;

    @PostMapping("/login")
    ApiResponse<LoginResponse> login(@RequestBody LoginRequest request){
        return ApiResponse.<LoginResponse>builder()
                .data(authenService.login(request))
                .build();
    }

    @PostMapping("/register")
    ApiResponse<String> register(@RequestBody RegisterRequest request){
        Boolean registStatus = authenService.register(request);
        String mess = "Đăng ký tài khoản thành công";
        int code = 200;

        if(registStatus == false){
            mess = "Đăng ký thất bại";
            code = 400;
        }

        return ApiResponse.<String>builder()
                .data(mess)
                .code(code)
                .build();
    }
    
}
