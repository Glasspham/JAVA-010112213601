package com.project.codebasespringjpa.dto.user.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    Long id;
    String username;
    String fullname;
    String email;
    String avatar;
    String position;
    String phone;
    List<String> majors;
    String role;
    LocalDateTime createDate;
}
