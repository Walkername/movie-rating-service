package ru.walkername.file_service.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.walkername.file_service.dto.FileAttachmentResponse;
import ru.walkername.file_service.dto.FileResponse;
import ru.walkername.file_service.models.FileAttachment;

import java.util.List;

@Repository
public interface FileAttachmentRepository extends JpaRepository<FileAttachment, Long> {

    @Query("select new ru.walkername.file_service.dto.FileResponse(f.id, f.url, f.uploadedAt) " +
            "from FileAttachment fa " +
            "join fa.file f " +
            "where fa.entityType = :entityType and fa.entityId = :entityId")
    Page<FileResponse> findByEntityTypeAndEntityId(
            @Param("entityType") String entityType,
            @Param("entityId") Long entityId,
            Pageable pageable
    );

    @Query("select new ru.walkername.file_service.dto.FileAttachmentResponse(fa.entityId, f.url, f.uploadedAt) " +
            "from FileAttachment fa " +
            "join fa.file f " +
            "where fa.entityType = :entityType " +
            "and fa.entityId in :entityIds")
    List<FileAttachmentResponse> findAllByEntityTypeAndEntityIds(
            @Param("entityType") String entityType,
            @Param("entityIds") List<Long> entityIds
    );

}
