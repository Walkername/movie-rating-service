package ru.walkername.file_service.dto;

import java.util.Date;

public class FileResponse {

    private Long fileId;

    private String url;

    private Date uploadedAt;

    public FileResponse() {
    }

    public FileResponse(Long fileId, String url, Date uploadedAt) {
        this.fileId = fileId;
        this.url = url;
        this.uploadedAt = uploadedAt;
    }

    public Long getFileId() {
        return fileId;
    }

    public void setFileId(Long fileId) {
        this.fileId = fileId;
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
