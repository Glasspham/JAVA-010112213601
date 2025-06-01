package com.project.codebasespringjpa.service.interfaces;

import com.project.codebasespringjpa.configuration.security.UserDetailsImpl;
import com.project.codebasespringjpa.dto.user.request.UserRequest;
import com.project.codebasespringjpa.dto.user.response.UserResponse;
import com.project.codebasespringjpa.entity.UserEntity;
import org.springframework.security.core.userdetails.UserDetailsService;


public interface IUserService extends UserDetailsService {
    long count();
    UserDetailsImpl getUserInContext();

    UserEntity findEntityById(Long id);
    UserResponse create(UserRequest request);

}
