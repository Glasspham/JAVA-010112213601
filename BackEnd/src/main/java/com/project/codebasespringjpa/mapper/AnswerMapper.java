package com.project.codebasespringjpa.mapper;

import com.project.codebasespringjpa.dto.answer.response.AnswerResponse;
import com.project.codebasespringjpa.entity.AnswerEntity;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AnswerMapper {

    public AnswerResponse toResponse(AnswerEntity entity){
        return AnswerResponse.builder()
                .id(entity.getId())
                .content(entity.getContent())
                .correct(entity.getCorrect())
                .build();
    }
}
