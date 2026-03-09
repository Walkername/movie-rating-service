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
@Table(name = "File")
public class File {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty(message = "File URL should not be empty")
    @Column(name = "url")
    private String url;

    @Column(name = "uploaded_at")
    private Instant uploadedAt;

    public File(String url, Instant uploadedAt) {
        this.url = url;
        this.uploadedAt = uploadedAt;
    }
}
