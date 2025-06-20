package com.project.codebasespringjpa.dto.question.response;

import com.project.codebasespringjpa.dto.answer.response.AnswerResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionResponse {
    Long id;

    String content;
    List<AnswerResponse> answers;
}
