package ru.walkername.file_service.dto;

import java.util.Date;

public class FileAttachmentResponse {

    private Long entityId;

    private String url;

    private Date uploadedAt;

    public FileAttachmentResponse() {
    }

    public FileAttachmentResponse(Long entityId, String url, Date uploadedAt) {
        this.entityId = entityId;
        this.url = url;
        this.uploadedAt = uploadedAt;
    }

    public Long getEntityId() {
        return entityId;
    }

    public void setEntityId(Long entityId) {
        this.entityId = entityId;
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
