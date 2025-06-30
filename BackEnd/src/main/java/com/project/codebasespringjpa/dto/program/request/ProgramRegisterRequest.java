package com.project.codebasespringjpa.dto.program.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProgramRegisterRequest {
    String username;
    Long programId;
}
