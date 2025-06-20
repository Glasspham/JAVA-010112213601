package com.project.codebasespringjpa.mapper;

import com.project.codebasespringjpa.dto.question.response.QuestionResponse;
import com.project.codebasespringjpa.dto.survey.request.SurveyRequest;
import com.project.codebasespringjpa.dto.survey.response.SurveyResponse;
import com.project.codebasespringjpa.entity.QuestionEntity;
import com.project.codebasespringjpa.entity.SurveyEntity;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SurveyMapper {
    @Autowired
    QuestionMapper questionMapper;

    public SurveyResponse toResponse(SurveyEntity entity){
        List<QuestionResponse> questionResponses = new ArrayList<>();

        if(entity != null && entity.getQuestions() != null){
            for (QuestionEntity question: entity.getQuestions()){
                questionResponses.add(questionMapper.toResponse(question));
            }
        }

        return SurveyResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .type(entity.getType())
                .questions(questionResponses)
                .build();
    }

    public SurveyEntity toEntity(SurveyRequest request){
        return SurveyEntity.builder()
                .id(request.getId())
                .name(request.getName())
                .type(request.getType())
                .build();
    }
}
