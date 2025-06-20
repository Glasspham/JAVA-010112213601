package com.project.codebasespringjpa.dto.survey.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SurveyResultRequest {
    String username;
    Long idSurvey;
    Double mark;
}
