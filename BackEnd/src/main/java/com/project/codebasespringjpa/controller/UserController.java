package com.project.codebasespringjpa.controller;

import com.project.codebasespringjpa.dto.user.request.UserRequest;
import com.project.codebasespringjpa.dto.user.request.UserSearch;
import com.project.codebasespringjpa.dto.user.response.UserResponse;
import com.project.codebasespringjpa.exception.ApiResponse;
import com.project.codebasespringjpa.service.interfaces.IUserService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE)
@RequestMapping("/users")
public class UserController {
    @Autowired
    IUserService userService;

    @GetMapping("")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SPECIALIST')")
    ApiResponse<UserResponse> findById(@RequestParam(name = "id") Long id) {
        return ApiResponse.<UserResponse>builder()
                .data(userService.findByid(id))
                .build();
    }

    @GetMapping("/find-all")
    @PreAuthorize("hasRole('ADMIN')")
    ApiResponse<Page<UserResponse>> findAll(@RequestParam(name = "page", defaultValue = "1") Integer page,
                                            @RequestParam(name = "limit", defaultValue = "5") Integer limit,
                                            @RequestParam(name = "keyword", required = false) String keyword,
                                            @RequestParam(name = "roleName", required = false) String roleName,
                                            @RequestParam(name = "majorName", required = false) String majorName){

        Pageable pageable = PageRequest.of(page-1, limit);
        UserSearch userSearch = UserSearch.builder()
                .keyword(keyword)
                .roleName(roleName)
                .majorName(majorName)
                .build();

        return ApiResponse.<Page<UserResponse>>builder()
                .data(userService.findAll(pageable, userSearch))
                .build();
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    ApiResponse<UserResponse> create(@RequestBody UserRequest request) {
        return ApiResponse.<UserResponse>builder()
                .data(userService.create(request))
                .build();
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    ApiResponse<UserResponse> update(@PathVariable Long id, @RequestBody UserRequest request) {
        return ApiResponse.<UserResponse>builder()
                .data(userService.update(id, request))
                .build();
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    ApiResponse<String> delete(@PathVariable Long id) {
        userService.delete(id);
        return ApiResponse.<String>builder()
                .data("Xóa thành công")
                .build();
    }

    @GetMapping("/list-specialist")
    public ApiResponse<List<UserResponse>> findAllSpecialist(){
        return ApiResponse.<List<UserResponse>>builder().data(userService.findAllSpecialist()).build();
    }

    @GetMapping("/list-user")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<UserResponse>> findAllUser(){
        return ApiResponse.<List<UserResponse>>builder().data(userService.findAllUser()).build();
    }
}
