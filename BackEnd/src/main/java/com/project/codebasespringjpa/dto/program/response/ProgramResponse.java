package com.project.codebasespringjpa.dto.program.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProgramResponse {
    Long id;
    String title;
    String image;
    String address;
    LocalDate date;
    LocalTime time;
    String status;
    Long capacity;
    String description;
}