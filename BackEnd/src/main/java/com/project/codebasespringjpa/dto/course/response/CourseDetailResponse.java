package com.project.codebasespringjpa.dto.course.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseDetailResponse {
    Long id;
    String name;
    String video;
    Double duration;
    String objective;
    String content;
}
