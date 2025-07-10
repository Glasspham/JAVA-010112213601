package com.project.codebasespringjpa.util;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

public class UtilFile {
    private static final String RESOURCE_DIR = getResourceDirectory();
    
    private static String getResourceDirectory() {
        String dockerEnv = System.getenv("DOCKER_ENV");
        if (dockerEnv != null && !dockerEnv.isEmpty()) {
            // Môi trường Docker
            return "/app/static/";
        }
        return System.getProperty("user.dir") + "/src/main/resources/static/";
    }

    public static String saveFileToStaticFolder(MultipartFile file) throws IOException {
        if (file.isEmpty()) throw new IllegalArgumentException("File empty");
        // Tạo tên file duy nhất
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String newFileName = UUID.randomUUID() + fileExtension;
        saveTo(file, RESOURCE_DIR, newFileName);
        return newFileName;
    }

    private static void saveTo(MultipartFile file, String dirPath, String fileName) throws IOException {
        Path path = Paths.get(dirPath);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }
        Path filePath = path.resolve(fileName);
        Files.write(filePath, file.getBytes());
    }

    public static boolean hasImage(String imagePath){
        if(imagePath == null || imagePath.isEmpty())
            return false;
        return true;
    }
}
