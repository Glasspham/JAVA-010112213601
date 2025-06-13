package com.project.codebasespringjpa.service.interfaces;

import com.project.codebasespringjpa.dto.user.response.UserResponse;
import com.project.codebasespringjpa.entity.UserEntity;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface IUserService extends UserDetailsService {
    UserEntity findEntityById(Long id);
    UserResponse findByUsername(String username);
}
