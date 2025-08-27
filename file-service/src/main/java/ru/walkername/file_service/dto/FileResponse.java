package ru.walkername.file_service.dto;

import java.util.Date;

public class FileResponse {

    private int fileId;

    private String url;

    private Date uploadedAt;

    public FileResponse() {
    }

    public FileResponse(int fileId, String url, Date uploadedAt) {
        this.fileId = fileId;
        this.url = url;
        this.uploadedAt = uploadedAt;
    }

    public int getFileId() {
        return fileId;
    }

    public void setFileId(int fileId) {
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
