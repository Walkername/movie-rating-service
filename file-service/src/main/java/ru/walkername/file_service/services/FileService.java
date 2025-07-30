package ru.walkername.file_service.services;

import io.minio.*;
import io.minio.http.Method;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.walkername.file_service.models.File;
import ru.walkername.file_service.repositories.FileRepository;

import java.io.InputStream;
import java.util.Date;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@Transactional(readOnly = true)
public class FileService {

    private final MinioClient minioClient;
    private final FileRepository fileRepository;

    @Value("${minio.bucket-name}")
    private String bucketName;

    @Autowired
    public FileService(MinioClient minioClient, FileRepository fileRepository) {
        this.minioClient = minioClient;
        this.fileRepository = fileRepository;
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
    public int uploadFile(String filename, MultipartFile file) {
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
            return savedFile.getId();
        } catch (Exception e) {
            throw new RuntimeException("Error uploading file", e);
        }
    }

    public String generatePresignedUrl(String objectName, int expirationMinutes) {
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
            return generatePresignedUrl(fileUrl, 10);
        }
        return null;
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
