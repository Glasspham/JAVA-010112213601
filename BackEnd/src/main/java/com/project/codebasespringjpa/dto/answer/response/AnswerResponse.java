package com.project.codebasespringjpa.dto.answer.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AnswerResponse {
    Long id;
    String content;
    Boolean correct = false;
}
