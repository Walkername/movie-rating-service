package ru.walkername.file_service.services;

import io.minio.*;
import io.minio.http.Method;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.walkername.file_service.dto.FileResponse;
import ru.walkername.file_service.events.FileUploaded;
import ru.walkername.file_service.models.File;
import ru.walkername.file_service.models.FileAttachment;
import ru.walkername.file_service.repositories.FileRepository;

import java.io.InputStream;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@Transactional(readOnly = true)
public class FileService {

    private final MinioClient minioClient;
    private final FileRepository fileRepository;
    private final KafkaProducerService kafkaProducerService;
    private final FileAttachmentService fileAttachmentService;

    @Value("${minio.bucket-name}")
    private String bucketName;

    @Autowired
    public FileService(MinioClient minioClient, FileRepository fileRepository, KafkaProducerService kafkaProducerService, FileAttachmentService fileAttachmentService) {
        this.minioClient = minioClient;
        this.fileRepository = fileRepository;
        this.kafkaProducerService = kafkaProducerService;
        this.fileAttachmentService = fileAttachmentService;
    }

    @PostConstruct
    public void initBucket() {
        try {
            boolean exists = minioClient.bucketExists(BucketExistsArgs.builder()
                    .bucket(bucketName)
                    .build());
            if (!exists) {
                minioClient.makeBucket(MakeBucketArgs.builder()
                        .bucket(bucketName)
                        .build());
            }
        } catch (Exception e) {
            throw new RuntimeException("Could not initialize bucket", e);
        }
    }

    @Transactional
    public void uploadFile(String filename, MultipartFile file, String context, int contextId) {
        try (InputStream is = file.getInputStream()) {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(filename)
                            .stream(is, file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );

            File savedFile = new File(filename, new Date());
            fileRepository.save(savedFile);

            FileAttachment fileAttachment = new FileAttachment(
                    savedFile,
                    context.replaceAll("-.*", ""),
                    contextId,
                    new Date()
            );
            fileAttachmentService.save(fileAttachment);

            if (context.equals("user-avatar") || context.equals("movie-poster")) {
                // Create event to send to Kafka Topic
                FileUploaded fileUploaded = new FileUploaded(
                        savedFile.getId(),
                        contextId,
                        context
                );

                // Publish event FileUploaded to Kafka
                kafkaProducerService.publishFileUploaded(fileUploaded);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error uploading file", e);
        }
    }

    public String generatePreSignedUrl(String objectName, int expirationMinutes) {
        try {
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(bucketName)
                            .object(objectName)
                            .expiry(expirationMinutes, TimeUnit.MINUTES)
                            .build()
            );
        } catch (Exception e) {
            throw new RuntimeException("Error generating signed URL", e);
        }
    }

    public String downloadById(int fileId) {
        Optional<File> file = fileRepository.findById(fileId);
        if (file.isPresent()) {
            String fileUrl = file.get().getUrl();
            return generatePreSignedUrl(fileUrl, 10);
        }
        return null;
    }

    public List<FileResponse> findAllByEntityTypeAndEntityId(String entityType, int entityId) {
        List<FileResponse> files = fileAttachmentService.findAllByEntityTypeAndEntityId(entityType, entityId);
        for (FileResponse file : files) {
            file.setUrl(generatePreSignedUrl(file.getUrl(), 10));
        }
        return files;
    }

    public byte[] downloadFile(String filename) {
        try (InputStream is = minioClient.getObject(
                GetObjectArgs.builder()
                        .bucket(bucketName)
                        .object(filename)
                        .build())) {
            return is.readAllBytes();
        } catch (Exception e) {
            throw new RuntimeException("Error downloading file", e);
        }
    }

    @Transactional
    public void deleteFile(String filename) {
        try {
            minioClient.removeObject(RemoveObjectArgs.builder()
                    .bucket(bucketName)
                    .object(filename)
                    .build());
        } catch (Exception e) {
            throw new RuntimeException("Error deleting file", e);
        }
    }

}
