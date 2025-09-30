package ru.walkername.file_service.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import ru.walkername.file_service.exceptions.InvalidUploadContextException;
import ru.walkername.file_service.services.FileService;

import java.util.UUID;

@RestController
@RequestMapping("/admin/files")
public class AdminFileController {

    private final FileService fileService;

    public AdminFileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/upload")
    public ResponseEntity<HttpStatus> upload(
            @RequestParam(value = "file") MultipartFile file,
            @RequestParam(value = "context") String context,
            @RequestParam(value = "id") Long id
    ) {
        String uniqueUrl;
        String originalFilename = file.getOriginalFilename();
        String extension = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        // Admin can upload any files for any users or movies
        // So it's not necessary to use auth principal in order to get authId
        // But it is better not to use non-existent contexts
        switch (context) {
            case "user", "user-avatar", "movie", "movie-poster" -> {
                String transformedContext = context.replaceAll("-.*", "");
                uniqueUrl = transformedContext + "-" + id + "/" + UUID.randomUUID() + extension;
            }

            default -> {
                throw new InvalidUploadContextException("There is no such context");
            }
        }
        fileService.uploadFile(uniqueUrl, file, context, id);
        return ResponseEntity.ok().build();
    }

}
