package com.project.codebasespringjpa.dto.user.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserRequest {
    String username;
    String fullname;
    String password;
    String email;
    String avatar;
    String position;
    String phone;
    List<String> majors;
    String role;
}
