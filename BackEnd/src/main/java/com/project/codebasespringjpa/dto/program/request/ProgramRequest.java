package com.project.codebasespringjpa.dto.program.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProgramRequest {
    Long id;

    String title;
    String address;
    LocalDate date;
    Integer hourse;
    Integer minus;
    String status;
    Long capacity;
}
