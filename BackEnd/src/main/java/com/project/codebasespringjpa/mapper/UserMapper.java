package com.project.codebasespringjpa.mapper;

import com.project.codebasespringjpa.dto.user.request.UserRequest;
import com.project.codebasespringjpa.dto.user.response.UserResponse;
import com.project.codebasespringjpa.entity.MajorEntity;
import com.project.codebasespringjpa.entity.RoleEntity;
import com.project.codebasespringjpa.entity.UserEntity;
import com.project.codebasespringjpa.exception.AppException;
import com.project.codebasespringjpa.exception.ErrorCode;
import com.project.codebasespringjpa.repository.IMajorRepository;
import com.project.codebasespringjpa.repository.IRoleRepository;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserMapper {
    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    IMajorRepository majorRepository;

    @Autowired
    IRoleRepository roleRepository;

    public UserEntity toEntity(UserRequest request){
        List<MajorEntity> majorList = new ArrayList<>();

        if(request != null && request.getMajors() != null){
            for (String it: request.getMajors()){
                MajorEntity major = majorRepository.findByName(it);
                if(major != null)
                    majorList.add(major);
            }
        }

        RoleEntity role = roleRepository.findByName(request.getRole()).orElseThrow(
                () -> new AppException(ErrorCode.ROLE_NOT_FOUND)
        );

        return UserEntity.builder()
                .username(request.getUsername())
                .fullname(request.getFullname())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .avatar(request.getAvatar())
                .position(request.getPosition())
                .phone(request.getPhone())
                .majors(majorList)
                .role(role)
                .build();
    }

    public UserResponse toResponse(UserEntity entity){
        List<String> majorList = new ArrayList<>();

        try {
            for (var it: entity.getMajors())
                majorList.add(it.getName());
        }catch (Exception e){

        }

        return UserResponse.builder()
                .id(entity.getId())
                .username(entity.getUsername())
                .fullname(entity.getFullname())
                .email(entity.getEmail())
                .avatar(entity.getAvatar())
                .position(entity.getPosition())
                .phone(entity.getPhone())
                .majors(majorList)
                .role(entity.getRole().getName())
                .createDate(entity.getCreateDate())
                .build();
    }
}
