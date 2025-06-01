package com.project.codebasespringjpa.service.imp;

import com.project.codebasespringjpa.configuration.security.UserDetailsImpl;
import com.project.codebasespringjpa.dto.user.request.UserRequest;
import com.project.codebasespringjpa.dto.user.response.UserResponse;
import com.project.codebasespringjpa.entity.UserEntity;
import com.project.codebasespringjpa.mapper.UserMapper;
import com.project.codebasespringjpa.repository.IUserRepository;
import com.project.codebasespringjpa.service.interfaces.IUserService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserService implements IUserService {
    @Autowired
    IUserRepository userRepository;

    @Autowired
    UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByUsername(username).orElse(null);

        return new UserDetailsImpl(user);
    }

    @Override
    public long count() {
        return userRepository.count();
    }

    @Override
    public UserDetailsImpl getUserInContext() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            if (userDetails instanceof UserDetailsImpl)
                return (UserDetailsImpl) userDetails;
        } catch (Exception e) {
            return null;
        }
        return null;
    }

    @Override
    public UserEntity findEntityById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public UserResponse create(UserRequest request) {
        UserEntity save = userRepository.save(userMapper.toEntity(request));
        return userMapper.toResponse(save);
    }


}
