package com.project.codebasespringjpa.dto.appointment.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AppointmentRequest {
    Long id;

    Long userId;

    String username;

    Long specialistId;

    String specialistName;

    LocalDate date;

    LocalTime hours;

    Double duration;

    String status;
}
