package com.project.codebasespringjpa.controller;

import com.project.codebasespringjpa.dto.authen.request.LoginRequest;
import com.project.codebasespringjpa.dto.authen.request.PasswordRequest;
import com.project.codebasespringjpa.dto.authen.request.RegisterRequest;
import com.project.codebasespringjpa.dto.authen.response.LoginResponse;
import com.project.codebasespringjpa.dto.user.request.UserRequest;
import com.project.codebasespringjpa.dto.user.response.UserResponse;
import com.project.codebasespringjpa.exception.ApiResponse;
import com.project.codebasespringjpa.service.interfaces.IAuthenService;
import com.project.codebasespringjpa.service.interfaces.IUserService;
import io.swagger.v3.oas.annotations.Operation;
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
    @Autowired
    IUserService userService;

    @PostMapping("/login")
    ApiResponse<LoginResponse> login(@RequestBody LoginRequest request){
        return ApiResponse.<LoginResponse>builder()
                .data(authenService.login(request))
                .build();
    }

    @Operation(summary = "Tim user theo username")
    @GetMapping("")
    ApiResponse<UserResponse> findByUsername(@RequestParam(name = "username") String username){
        return ApiResponse.<UserResponse>builder()
                .data(userService.findByUsername(username))
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

    @Operation(summary = "Cap nhat thong tin nguoi dung")
    @PutMapping("/update")
    ApiResponse<UserResponse> updateProfile(@RequestParam(name ="username")String username, @RequestBody UserRequest request){
        UserResponse user = userService.findByUsername(username);
        return ApiResponse.<UserResponse>builder().data(userService.update(user.getId(), request)).build();
    }

    @Operation(summary = "Cap nhat mat khau nguoi dung")
    @PutMapping("/update-password")
    ApiResponse<UserResponse> updateProfile(@RequestParam(name ="username")String username, @RequestBody PasswordRequest request){
        UserResponse user = userService.findByUsername(username);
        return ApiResponse.<UserResponse>builder().data(userService.changePassword(user.getId(), request)).build();
    }
}
