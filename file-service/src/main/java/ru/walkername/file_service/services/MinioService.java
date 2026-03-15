package ru.walkername.file_service.services;

import io.minio.*;
import io.minio.http.Method;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.walkername.file_service.exceptions.FileUploadFailException;
import ru.walkername.file_service.exceptions.UrlGenerationException;

import java.io.InputStream;
import java.util.concurrent.TimeUnit;

@Slf4j
@RequiredArgsConstructor
@Service
public class MinioService {

    private final MinioClient minioClient;

    @Value("${minio.bucket-name}")
    private String bucketName;

    @Value("${minio.internal.endpoint}")
    private String internalEndpoint;

    @Value("${minio.public.url}")
    private String publicUrl;

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
            log.error("Failed to initialize Minio Bucket: bucketName={}", bucketName);
            throw new RuntimeException("Could not initialize bucket", e);
        }
    }

    public void upload(String filename, MultipartFile file) {
        try (InputStream is = file.getInputStream()) {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(filename)
                            .stream(is, file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to upload file: filename={}", filename);
            throw new FileUploadFailException("Failed to upload file to MinIO");
        }
    }

    public String generatePreSignedUrl(String objectName, int expirationMinutes) {
        try {
            String presignedUrl = minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(bucketName)
                            .object(objectName)
                            .expiry(expirationMinutes, TimeUnit.MINUTES)
                            .build()
            );

            return presignedUrl.replace(internalEndpoint, publicUrl);
        } catch (Exception e) {
            log.error("Failed to generate pre-signed url for objectName(filename)={}", objectName);
            throw new UrlGenerationException("Error generating signed URL: " + e.getMessage());
        }
    }

    public void deleteFile(String filename) {
        try {
            minioClient.removeObject(RemoveObjectArgs.builder()
                    .bucket(bucketName)
                    .object(filename)
                    .build());
        } catch (Exception e) {
            log.error("Failed to delete file: filename={}", filename);
            throw new RuntimeException("Error deleting file", e);
        }
    }

    public byte[] downloadFile(String filename) {
        try (InputStream is = minioClient.getObject(
                GetObjectArgs.builder()
                        .bucket(bucketName)
                        .object(filename)
                        .build())) {
            return is.readAllBytes();
        } catch (Exception e) {
            log.error("Failed to download file: filename={}", filename);
            throw new RuntimeException("Error downloading file", e);
        }
    }

}
