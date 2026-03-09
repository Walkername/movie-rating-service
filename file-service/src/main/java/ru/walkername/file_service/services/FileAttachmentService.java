package ru.walkername.file_service.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.walkername.file_service.dto.FileAttachmentResponse;
import ru.walkername.file_service.dto.FileResponse;
import ru.walkername.file_service.models.FileAttachment;
import ru.walkername.file_service.repositories.FileAttachmentRepository;

import java.util.List;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class FileAttachmentService {

    private final FileAttachmentRepository fileAttachmentRepository;

    @Transactional
    public void save(FileAttachment fileAttachment) {
        fileAttachmentRepository.save(fileAttachment);
    }

    public Page<FileResponse> findAllByEntityTypeAndEntityId(String entityType, Long entityId, Pageable pageable) {
        return fileAttachmentRepository.findByEntityTypeAndEntityId(entityType, entityId, pageable);
    }

    public List<FileAttachmentResponse> findAllById(List<Long> ids) {
        return fileAttachmentRepository.findAllByIds(ids);
    }

}
