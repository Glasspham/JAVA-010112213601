package com.project.codebasespringjpa.dto.survey.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SurveyResultResponse {
    Long id;
    String fullname;
    String surveyName;
    Double mark;
    LocalDate createDate;
}
