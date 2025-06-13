package com.project.codebasespringjpa.controller;

import com.project.codebasespringjpa.dto.authen.request.LoginRequest;
import com.project.codebasespringjpa.dto.authen.response.LoginResponse;
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
}
