package com.project.codebasespringjpa.mapper;

import com.project.codebasespringjpa.dto.appointment.request.AppointmentRequest;
import com.project.codebasespringjpa.dto.appointment.response.AppointmentResponse;
import com.project.codebasespringjpa.dto.user.response.UserResponse;
import com.project.codebasespringjpa.entity.AppointmentEntity;
import com.project.codebasespringjpa.repository.IUserRepository;
import com.project.codebasespringjpa.service.interfaces.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AppointmentMapper {
    @Autowired
    IUserRepository userRepository;
    @Autowired
    IUserService userService;

    public AppointmentEntity toEntity(AppointmentRequest request) {
        UserResponse userResponse = userService.findByUsername(request.getUsername());
        UserResponse specialResponse = userService.findByUsername(request.getSpecialistName());
        return AppointmentEntity.builder()
                .userId(userResponse.getId())
                .username(request.getUsername())
                .specialistId(specialResponse.getId())
                .specialistName(request.getSpecialistName())
                .date(request.getDate())
                .hours(request.getHours())
                .duration(request.getDuration())
                .status(request.getStatus())
                .build();
    }

    public AppointmentResponse toResponse(AppointmentEntity entity) {
        UserResponse userAcc = userService.findByUsername(entity.getUsername());
        UserResponse specialAcc = userService.findByUsername(entity.getSpecialistName());
        return AppointmentResponse.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .userName(entity.getUsername())
                .userFullName(userAcc.getFullname())
                .specialistId(entity.getSpecialistId())
                .specialistName(entity.getSpecialistName())
                .specialistFullname(specialAcc.getFullname())
                .date(entity.getDate())
                .hours(entity.getHours())
                .duration(entity.getDuration())
                .status(entity.getStatus())
                .build();
    }
}
