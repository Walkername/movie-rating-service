package ru.walkername.file_service.services;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;
import ru.walkername.file_service.dto.FileAttachmentResponse;
import ru.walkername.file_service.dto.FileResponse;
import ru.walkername.file_service.dto.PageResponse;
import ru.walkername.file_service.events.FileUploaded;
import ru.walkername.file_service.exceptions.FileNotFoundException;
import ru.walkername.file_service.exceptions.InvalidUploadContextException;
import ru.walkername.file_service.models.File;
import ru.walkername.file_service.models.FileAttachment;
import ru.walkername.file_service.repositories.FileRepository;

import java.time.Instant;
import java.util.*;

@RequiredArgsConstructor
@Service
public class FileService {

    private final MinioService minioService;
    private final FileRepository fileRepository;
    private final KafkaProducerService kafkaProducerService;
    private final FileAttachmentService fileAttachmentService;
    private final ApplicationContext applicationContext;

    public void upload(MultipartFile file, String context, Long userId) {
        checkContextCorrectness(context);

        uploadFile(file, context, userId);
    }

    private void checkContextCorrectness(String context) {
        if (!context.equals("user") && !context.equals("user-avatar")) {
            throw new InvalidUploadContextException("There is no such context");
        }
    }

    private void uploadFile(MultipartFile file, String context, Long userId) {
        String filename = makeUniqueUrl(file, context, userId);

        // Upload the file to MinIO
        minioService.upload(filename, file);

        // Save File and FileAttachment in DB
        FileService self = applicationContext.getBean(FileService.class);
        self.saveFileAndAttachmentAndPublishEvent(filename, context, userId);
    }

    private String makeUniqueUrl(MultipartFile file, String context, Long userId) {
        String extension = makeExtension(file.getOriginalFilename());

        String transformedContext = context.replaceAll("-.*", "");

        return transformedContext + "-" + userId + "/" + UUID.randomUUID() + extension;
    }

    private String makeExtension(String originalFilename) {
        String extension = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        return extension;
    }

    @Transactional
    public void saveFileAndAttachmentAndPublishEvent(String filename, String context, Long contextId) {
        File savedFile = fileRepository.save(new File(filename, Instant.now()));

        FileAttachment fileAttachment = new FileAttachment(
                savedFile,
                context.replaceAll("-.*", ""),
                contextId,
                Instant.now()
        );
        fileAttachmentService.save(fileAttachment);

        // After transaction commit publish Kafka event
        registerFileUploadedEvent(savedFile, context, contextId);
    }

    private void registerFileUploadedEvent(File savedFile, String context, Long contextId) {
        if (Set.of("user-avatar", "movie-poster").contains(context)) {
            FileUploaded fileUploaded = new FileUploaded(savedFile.getId(), contextId, context);

            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    kafkaProducerService.publishFileUploaded(fileUploaded);
                }
            });
        }
    }

    public String downloadById(Long fileId) {
        File file = fileRepository.findById(fileId).orElseThrow(
                () -> new FileNotFoundException("File not found")
        );

        return minioService.generatePreSignedUrl(file.getUrl(), 10);
    }

    public PageResponse<FileResponse> findAllByEntityTypeAndEntityId(
            String entityType,
            Long entityId,
            int page,
            int moviesPerPage,
            String[] sort
    ) {
        Sort sorting = Sort.by(createOrders(sort));
        Pageable pageable = PageRequest.of(page, moviesPerPage, sorting);

        Page<FileResponse> files = fileAttachmentService.findAllByEntityTypeAndEntityId(entityType, entityId, pageable);

        List<FileResponse> filesWithPresignedUrl = files.getContent().stream()
                .map(file ->
                        new FileResponse(
                                file.fileId(),
                                minioService.generatePreSignedUrl(file.url(), 10),
                                file.uploadedAt()
                        )
                )
                .toList();

        return new PageResponse<>(
                filesWithPresignedUrl,
                page,
                moviesPerPage,
                files.getTotalElements(),
                files.getTotalPages()
        );
    }

    private List<Sort.Order> createOrders(String[] sort) {
        return Arrays.stream(sort).map(this::parseSort).toList();
    }

    private Sort.Order parseSort(String sortParam) {
        String[] parts = sortParam.split(":");
        String property = parts[0];
        Sort.Direction direction = parts.length > 1 ? Sort.Direction.fromString(parts[1]) : Sort.Direction.DESC;
        return new Sort.Order(direction, property);
    }

    public List<FileAttachmentResponse> findAllByEntityTypeAndEntityIds(List<Long> ids) {
        List<FileAttachmentResponse> files = fileAttachmentService.findAllById(ids);

        return files.stream()
                .map(file ->
                        new FileAttachmentResponse(
                                file.entityId(),
                                minioService.generatePreSignedUrl(file.url(), 10),
                                file.uploadedAt()
                        )
                )
                .toList();
    }

}
