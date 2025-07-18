package com.project.codebasespringjpa.dto.statics;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StaticProgramResponse {
    Integer cntProgram;
    Integer cntRegister;
}
