package com.project.codebasespringjpa.dto.course.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseResponse {
    Long id;

    String name;
    String description;
    Double duration;
    String sallybus;
    String avatar;

    LocalDateTime createDate;

    List<String> objects;
    List<String> users;
}
