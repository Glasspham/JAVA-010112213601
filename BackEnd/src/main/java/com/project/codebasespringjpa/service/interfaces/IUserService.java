package com.project.codebasespringjpa.service.interfaces;

import com.project.codebasespringjpa.configuration.security.UserDetailsImpl;
import com.project.codebasespringjpa.dto.authen.request.PasswordRequest;
import com.project.codebasespringjpa.dto.user.request.UserRequest;
import com.project.codebasespringjpa.dto.user.request.UserSearch;
import com.project.codebasespringjpa.dto.user.response.UserResponse;
import com.project.codebasespringjpa.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetailsService;
import java.util.List;

public interface IUserService extends UserDetailsService {
    long count();
    UserDetailsImpl getUserInContext();
    UserEntity findEntityById(Long id);
    UserResponse create(UserRequest request);
    UserResponse update(Long id, UserRequest request);
    UserResponse findByid(Long id);
    UserResponse findByUsername(String username);
    UserResponse changePassword(Long id, PasswordRequest passwordRequest);
    Page<UserResponse> findAll(Pageable pageable, UserSearch userSearch);
    void delete(Long id);
    List<UserResponse> findAllSpecialist();
    List<UserResponse> findAllUser();
}