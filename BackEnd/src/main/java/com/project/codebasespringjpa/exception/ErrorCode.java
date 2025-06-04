package com.project.codebasespringjpa.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(-1, "Lỗi không xác định"),
    UNAUTHEN(401, "Chưa đăng nhập"),
    FORBIDDEN(403, "Không có quyền truy cập"),

    //---user exception
    USER_NOT_FOUND(404, "Không tìm thấy user"),

    ROLE_NOT_FOUND(404, "Không tồn tại role này"),

    COURSE_NOT_FOUND(404, "Không tìm thấy khoá học này"),

    SURVEY_NOT_FOUND(404, "Không tìm thấy khảo sát này"),

    APPOINMENT_NOT_FOUND(404, "Không tìm thấy lịch hẹn này"),

    PROGRAM_NOT_FOUND(404, "Không tìm thấy chương trình này"),
    ;

    private int code;
    private String message;
}
