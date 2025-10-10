package ru.walkername.file_service.services;

import org.springframework.beans.factory.annotation.Autowired;
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
import ru.walkername.file_service.dto.FileResponse;
import ru.walkername.file_service.dto.PageResponse;
import ru.walkername.file_service.events.FileUploaded;
import ru.walkername.file_service.models.File;
import ru.walkername.file_service.models.FileAttachment;
import ru.walkername.file_service.repositories.FileRepository;

import java.util.*;

@Service
public class FileService {

    private final MinioService minioService;
    private final FileRepository fileRepository;
    private final KafkaProducerService kafkaProducerService;
    private final FileAttachmentService fileAttachmentService;
    private final ApplicationContext applicationContext;

    @Autowired
    public FileService(
            MinioService minioService,
            FileRepository fileRepository,
            KafkaProducerService kafkaProducerService,
            FileAttachmentService fileAttachmentService,
            ApplicationContext applicationContext
    ) {
        this.minioService = minioService;
        this.fileRepository = fileRepository;
        this.kafkaProducerService = kafkaProducerService;
        this.fileAttachmentService = fileAttachmentService;
        this.applicationContext = applicationContext;
    }

    public void uploadFile(String filename, MultipartFile file, String context, Long contextId) {
        // Upload the file to MinIO
        minioService.upload(filename, file);

        // Save File and FileAttachment in DB
        FileService self = applicationContext.getBean(FileService.class);
        self.saveFileAndAttachmentAndPublishEvent(filename, context, contextId);
    }

    @Transactional
    public void saveFileAndAttachmentAndPublishEvent(String filename, String context, Long contextId) {
        File savedFile = fileRepository.save(new File(filename, new Date()));

        FileAttachment fileAttachment = new FileAttachment(
                savedFile,
                context.replaceAll("-.*", ""),
                contextId,
                new Date()
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
        Optional<File> file = fileRepository.findById(fileId);
        if (file.isPresent()) {
            String fileUrl = file.get().getUrl();
            return minioService.generatePreSignedUrl(fileUrl, 10);
        }
        return null;
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
        for (FileResponse file : files.getContent()) {
            file.setUrl(minioService.generatePreSignedUrl(file.getUrl(), 10));
        }
        return new PageResponse<>(
                files.getContent(),
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

}
