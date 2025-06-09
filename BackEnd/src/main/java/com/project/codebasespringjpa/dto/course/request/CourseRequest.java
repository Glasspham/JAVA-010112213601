package com.project.codebasespringjpa.dto.course.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseRequest {
    Long id;

    String name;
    String description;
    Double duration;
    String sallybus;
    String avatar;
    List<String> objects;
    List<String> users;
}
