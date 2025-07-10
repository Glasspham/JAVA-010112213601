package com.project.codebasespringjpa.mapper;

import com.project.codebasespringjpa.dto.survey.request.SurveyResultRequest;
import com.project.codebasespringjpa.dto.survey.response.SurveyResultResponse;
import com.project.codebasespringjpa.entity.SurveyEntity;
import com.project.codebasespringjpa.entity.SurveyResultEntity;
import com.project.codebasespringjpa.entity.UserEntity;
import com.project.codebasespringjpa.exception.AppException;
import com.project.codebasespringjpa.exception.ErrorCode;
import com.project.codebasespringjpa.repository.IUserRepository;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SurveyResultMapper {
    @Autowired
    IUserRepository userRepository;

    public SurveyResultEntity toEntity(SurveyResultRequest request) {
        UserEntity userEntity = userRepository.findByUsername(request.getUsername()).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_FOUND));
        SurveyEntity survey = SurveyEntity.builder().id(request.getIdSurvey()).build();
        return SurveyResultEntity.builder()
                .mark(request.getMark())
                .survey(survey)
                .user(userEntity)
                .build();
    }

    public SurveyResultResponse toResponse(SurveyResultEntity entity) {
        return SurveyResultResponse.builder()
                .id(entity.getId())
                .fullname(entity.getUser().getFullname())
                .surveyName(entity.getSurvey().getName())
                .mark(entity.getMark())
                .createDate(entity.getCreateDate().toLocalDate())
                .build();
    }
}
