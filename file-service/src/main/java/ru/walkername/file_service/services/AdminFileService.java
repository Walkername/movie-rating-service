package ru.walkername.file_service.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.walkername.file_service.exceptions.InvalidUploadContextException;

import java.util.UUID;

@RequiredArgsConstructor
@Service
public class AdminFileService {

    private final MinioService minioService;
    private final FileService fileService;

    public void upload(MultipartFile file, String context, Long contextId) {
        String filename = makeUrlByContext(file, context, contextId);

        // Upload the file to MinIO
        minioService.upload(filename, file);

        // Save File and FileAttachment in DB
        fileService.saveFileAndAttachmentAndPublishEvent(filename, context, contextId);
    }

    private String makeUrlByContext(MultipartFile file, String context, Long id) {
        String extension = makeExtension(file.getOriginalFilename());

        String baseContext = switch (context) {
            case "user", "user-avatar" -> "user";
            case "movie", "movie-poster" -> "movie";
            default -> throw new InvalidUploadContextException("There is no such context");
        };

        return baseContext + "-" + id + "/" + UUID.randomUUID() + extension;
    }

    private String makeExtension(String originalFilename) {
        String extension = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        return extension;
    }

}
