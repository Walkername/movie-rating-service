package ru.walkername.movie_catalog.events;

public class FileUploaded {

    private Long fileId;

    private Long contextId;

    private String context;

    public FileUploaded() {
    }

    public FileUploaded(Long fileId, Long contextId, String context) {
        this.fileId = fileId;
        this.contextId = contextId;
        this.context = context;
    }

    public Long getFileId() {
        return fileId;
    }

    public void setFileId(Long fileId) {
        this.fileId = fileId;
    }

    public Long getContextId() {
        return contextId;
    }

    public void setContextId(Long contextId) {
        this.contextId = contextId;
    }

    public String getContext() {
        return context;
    }

    public void setContext(String context) {
        this.context = context;
    }

}
