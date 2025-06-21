package com.project.codebasespringjpa.dto.course.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
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
    List<String> sallybus;
    String image;

    LocalDate createDate;
    LocalDate updateDate;

    List<String> objects;
    List<CourseDetailResponse> courseDetail;
}
