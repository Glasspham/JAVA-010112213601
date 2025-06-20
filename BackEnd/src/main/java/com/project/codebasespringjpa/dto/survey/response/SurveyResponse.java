package com.project.codebasespringjpa.dto.survey.response;

import com.project.codebasespringjpa.dto.question.response.QuestionResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SurveyResponse {
    Long id;
    String name;
    String type;

    List<QuestionResponse> questions;
}
