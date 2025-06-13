package com.project.codebasespringjpa.exception;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {
    // Xử lý lỗi xác thực (Validation errors)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse> handleValidationException(MethodArgumentNotValidException ex) {
        BindingResult bindingResult = ex.getBindingResult();
        StringBuilder errorMessage = new StringBuilder();

        for (ObjectError error : bindingResult.getAllErrors()) {
            errorMessage.append(error.getDefaultMessage()).append("; ");
        }

        ApiResponse apiResponse = ApiResponse.builder()
                .message("Validation failed: " + errorMessage.toString())
                .code(400)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    //----exception contraint
    @ExceptionHandler(value = ConstraintViolationException.class)
    public ResponseEntity<ApiResponse> handleConstraintViolationException(ConstraintViolationException ex) {
        // Lấy thông tin lỗi từ các ConstraintViolation
        StringBuilder message = new StringBuilder();
        for (ConstraintViolation<?> violation : ex.getConstraintViolations()) {
            message.append(violation.getMessage()).append(", ");
        }

        // Xử lý chuỗi lỗi và loại bỏ dấu phẩy thừa ở cuối
        String errorMessage = ( message.length() > 0 ? message.substring(0, message.length() - 2) : "Dữ liệu không hợp lệ");

        // Tạo ApiResponse với thông báo lỗi ngắn gọn
        ApiResponse apiResponse = ApiResponse.builder()
                .data(errorMessage)
                .message("Lỗi ràng buộc dữ liệu")
                .code(400)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    //----exception
    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse> handleException(AppException e){
        ApiResponse apiResponse = ApiResponse.builder()
                .message(e.getErrorCode().getMessage())
                .code(e.getErrorCode().getCode())
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    //---403 access dined
    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<ApiResponse> handleException(AccessDeniedException e){

        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.builder()
                        .code(403)
                        .message(ErrorCode.FORBIDDEN.getMessage())
                        .build()
        );
    }
}

