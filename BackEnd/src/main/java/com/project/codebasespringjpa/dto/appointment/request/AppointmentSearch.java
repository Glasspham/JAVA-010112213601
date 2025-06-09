package com.project.codebasespringjpa.dto.appointment.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AppointmentSearch {
    String keyword;
    String status;
    LocalDate date;
}
