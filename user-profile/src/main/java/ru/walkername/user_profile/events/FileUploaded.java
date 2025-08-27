package ru.walkername.user_profile.events;

public class FileUploaded {

    private int fileId;

    private Integer contextId;

    private String context;

    public FileUploaded() {
    }

    public FileUploaded(int fileId, Integer contextId, String context) {
        this.fileId = fileId;
        this.contextId = contextId;
        this.context = context;
    }

    public int getFileId() {
        return fileId;
    }

    public void setFileId(int fileId) {
        this.fileId = fileId;
    }

    public Integer getContextId() {
        return contextId;
    }

    public void setContextId(Integer contextId) {
        this.contextId = contextId;
    }

    public String getContext() {
        return context;
    }

    public void setContext(String context) {
        this.context = context;
    }
}
