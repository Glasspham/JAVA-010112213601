package com.project.codebasespringjpa.dto.program.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProgramSearch {
    String keyword;
    String status;
    LocalDate date;
}
