package com.project.codebasespringjpa.service.imp;

import com.project.codebasespringjpa.configuration.security.UserDetailsImpl;
import com.project.codebasespringjpa.configuration.security.jwtConfig.JwtProvider;
import com.project.codebasespringjpa.dto.authen.request.LoginRequest;
import com.project.codebasespringjpa.dto.authen.request.RegisterRequest;
import com.project.codebasespringjpa.dto.authen.response.LoginResponse;
import com.project.codebasespringjpa.entity.RoleEntity;
import com.project.codebasespringjpa.entity.UserEntity;
import com.project.codebasespringjpa.enums.RoleEnum;
import com.project.codebasespringjpa.repository.IUserRepository;
import com.project.codebasespringjpa.service.interfaces.IAuthenService;
import com.project.codebasespringjpa.util.UtilConst;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenService implements IAuthenService {
    @Autowired
    IUserRepository userRepository;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtProvider jwtProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public boolean register(RegisterRequest request) {
        try {
            UserEntity user = new UserEntity();
            user.setUsername(request.getUsername());
            user.setFullname(request.getFullname());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setPhone(request.getPhone());
            user.setEmail(request.getEmail());

            RoleEntity role = new RoleEntity(RoleEnum.USER.name());
            user.setRole(role);
            user.setAvatar(UtilConst.IMAGE_USER_DEFAULT);
            userRepository.save(user);

            return true;
        }catch (Exception e){
            log.error(">>>Co loi trong qua trinh dang ky: " + e.getMessage());
            return false;
        }
    }
    
    @Override
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate
                (new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String jwt = jwtProvider.generateTokenByUsername(request.getUsername());

        return LoginResponse.builder()
                .token(jwt)
                .role(userDetails.getRoleName())
                .email(userDetails.getUserEntity().getEmail())
                .fullName(userDetails.getFullName())
                .build();
    }
}
