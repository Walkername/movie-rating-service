package ru.walkername.file_service.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;

import java.util.Date;

@Entity
@Table(name = "File")
public class File {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotEmpty(message = "File URL should not be empty")
    @Column(name = "url")
    private String url;


    @Column(name = "uploaded_at")
    private Date uploadedAt;

    public File() {
    }

    public File(String url, Date uploadedAt) {
        this.url = url;
        this.uploadedAt = uploadedAt;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Date getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(Date uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}
