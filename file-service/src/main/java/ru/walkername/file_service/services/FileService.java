package ru.walkername.file_service.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;
import ru.walkername.file_service.dto.FileResponse;
import ru.walkername.file_service.events.FileUploaded;
import ru.walkername.file_service.models.File;
import ru.walkername.file_service.models.FileAttachment;
import ru.walkername.file_service.repositories.FileRepository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional(readOnly = true)
public class FileService {

    private final MinioService minioService;
    private final FileRepository fileRepository;
    private final KafkaProducerService kafkaProducerService;
    private final FileAttachmentService fileAttachmentService;

    @Autowired
    public FileService(MinioService minioService, FileRepository fileRepository, KafkaProducerService kafkaProducerService, FileAttachmentService fileAttachmentService) {
        this.minioService = minioService;
        this.fileRepository = fileRepository;
        this.kafkaProducerService = kafkaProducerService;
        this.fileAttachmentService = fileAttachmentService;
    }

    public void uploadFile(String filename, MultipartFile file, String context, Long contextId) {
        // Upload the file to MinIO
        minioService.upload(filename, file);

        // Save File and FileAttachment in DB
        File savedFile = saveFileAndAttachment(filename, context, contextId);

        // After transaction commit publish Kafka event
        registerFileUploadedEvent(savedFile, context, contextId);
    }

    @Transactional
    public File saveFileAndAttachment(String filename, String context, Long contextId) {
        File savedFile = fileRepository.save(new File(filename, new Date()));

        FileAttachment fileAttachment = new FileAttachment(
                savedFile,
                context.replaceAll("-.*", ""),
                contextId,
                new Date()
        );
        fileAttachmentService.save(fileAttachment);

        return savedFile;
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

    public List<FileResponse> findAllByEntityTypeAndEntityId(String entityType, Long entityId) {
        List<FileResponse> files = fileAttachmentService.findAllByEntityTypeAndEntityId(entityType, entityId);
        for (FileResponse file : files) {
            file.setUrl(minioService.generatePreSignedUrl(file.getUrl(), 10));
        }
        return files;
    }

}
