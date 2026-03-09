package ru.walkername.file_service.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "file_attachment")
public class FileAttachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_id", nullable = false, unique = true)
    private File file;

    @NotEmpty(message = "Entity type should not be empty")
    private String entityType;

    private Long entityId;

    private Instant uploadedAt;

    public FileAttachment(File file, String entityType, Long entityId, Instant uploadedAt) {
        this.file = file;
        this.entityType = entityType;
        this.entityId = entityId;
        this.uploadedAt = uploadedAt;
    }
}
