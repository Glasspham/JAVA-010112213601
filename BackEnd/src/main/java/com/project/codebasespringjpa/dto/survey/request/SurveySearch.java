package com.project.codebasespringjpa.dto.survey.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SurveySearch {
    String keyword;
    String type;
}
