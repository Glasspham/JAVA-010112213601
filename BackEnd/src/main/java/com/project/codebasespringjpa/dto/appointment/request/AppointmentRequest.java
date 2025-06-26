package com.project.codebasespringjpa.dto.appointment.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
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

    String username;

    String specialistName;

    LocalDate date;

    @Schema(type = "string", example = "01:01:01")
    @JsonFormat(pattern = "HH:mm:ss")
    LocalTime hours;

    Double duration;

    String status;
}
