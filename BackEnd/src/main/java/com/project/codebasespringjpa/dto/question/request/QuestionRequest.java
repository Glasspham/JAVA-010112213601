package com.project.codebasespringjpa.dto.question.request;

import com.project.codebasespringjpa.dto.answer.request.AnswerRequest;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionRequest {
    Long id;
    String content;
    List<AnswerRequest> answers;
}
