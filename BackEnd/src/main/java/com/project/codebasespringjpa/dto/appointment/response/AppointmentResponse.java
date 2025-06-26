package com.project.codebasespringjpa.dto.appointment.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AppointmentResponse {
    Long id;
    Long userId;
    String userName;
    String userFullName;
    Long specialistId;
    String specialistName;
    String specialistFullname;
    LocalDate date;
    LocalTime hours;
    Double duration;
    String status;
}
