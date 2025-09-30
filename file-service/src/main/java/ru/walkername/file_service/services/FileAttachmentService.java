package ru.walkername.file_service.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.walkername.file_service.dto.FileResponse;
import ru.walkername.file_service.models.FileAttachment;
import ru.walkername.file_service.repositories.FileAttachmentRepository;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class FileAttachmentService {

    private final FileAttachmentRepository fileAttachmentRepository;

    @Autowired
    public FileAttachmentService(FileAttachmentRepository fileAttachmentRepository) {
        this.fileAttachmentRepository = fileAttachmentRepository;
    }

    @Transactional
    public void save(FileAttachment fileAttachment) {
        fileAttachmentRepository.save(fileAttachment);
    }

    public List<FileResponse> findAllByEntityTypeAndEntityId(String entityType, Long entityId) {
        return fileAttachmentRepository.findByEntityTypeAndEntityId(entityType, entityId);
    }

}
