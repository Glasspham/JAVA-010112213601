package com.project.codebasespringjpa.util;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

public class UtilFile {
    private static final String RESOURCE_DIR  = System.getProperty("user.dir") + "/src/main/resources/static/";
    private static final String TARGET_DIR = System.getProperty("user.dir") + "/target/classes/static/";

    public static String saveFileToStaticFolder(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File empty");
        }

        // Tạo tên file duy nhất
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String newFileName = UUID.randomUUID() + fileExtension;

        // Ghi vào cả RESOURCE và TARGET
        saveTo(file, RESOURCE_DIR, newFileName);
        saveTo(file, TARGET_DIR, newFileName);

        return  newFileName;
    }

    private static void saveTo(MultipartFile file, String dirPath, String fileName) throws IOException {
        Path path = Paths.get(dirPath);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }
        Path filePath = path.resolve(fileName);
        Files.write(filePath, file.getBytes());
    }

}
