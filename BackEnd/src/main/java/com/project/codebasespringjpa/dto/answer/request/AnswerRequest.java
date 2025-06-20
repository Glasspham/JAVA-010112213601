package com.project.codebasespringjpa.dto.answer.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AnswerRequest {
    Long id;
    String content;
    Boolean correct = false;
}
