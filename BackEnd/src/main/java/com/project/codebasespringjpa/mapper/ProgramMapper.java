package com.project.codebasespringjpa.mapper;

import com.project.codebasespringjpa.dto.program.request.ProgramRequest;
import com.project.codebasespringjpa.dto.program.response.ProgramResponse;
import com.project.codebasespringjpa.dto.user.response.UserResponse;
import com.project.codebasespringjpa.entity.ProgramEntity;
import com.project.codebasespringjpa.entity.UserEntity;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProgramMapper {
    @Autowired
    UserMapper userMapper;

    public ProgramEntity toEntity(ProgramRequest request) {
        LocalTime time = null;
        try {
            time = LocalTime.of(request.getHourse(), request.getMinus());
        } catch (Exception e) {
            log.error("Can not get time in request program: " + e.getMessage());
        }
        return ProgramEntity.builder()
                .title(request.getTitle())
                .image(request.getImage())
                .address(request.getAddress())
                .date(request.getDate())
                .time(time)
                .status(request.getStatus())
                .capacity(request.getCapacity())
                .description(request.getDescription())
                .build();
    }

    public ProgramResponse toResponse(ProgramEntity entity) {
        List<UserResponse> userResponses = new ArrayList<>();

        if (entity != null && entity.getUsers() != null) {
            for (UserEntity user : entity.getUsers()) {
                if (user.getIsDelete() == false) {
                    userResponses.add(userMapper.toResponse(user));
                }
            }
        }

        return ProgramResponse.builder()
                .id(entity.getId())
                .image(entity.getImage())
                .title(entity.getTitle())
                .address(entity.getAddress())
                .date(entity.getDate())
                .time(entity.getTime())
                .status(entity.getStatus())
                .capacity(entity.getCapacity())
                .users(userResponses)
                .description(entity.getDescription())
                .build();
    }
}
