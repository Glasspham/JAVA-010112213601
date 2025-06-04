package com.project.codebasespringjpa.controller;

import com.project.codebasespringjpa.exception.ApiResponse;
import com.project.codebasespringjpa.util.UtilFile;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/files")
public class FileController {
    @PostMapping("/upload")
    public ApiResponse<String> createFile(MultipartFile file) throws IOException {
        String fileName = UtilFile.saveFileToStaticFolder(file);
        return ApiResponse.<String>builder()
                .data(fileName)
                .build();
    }
}
