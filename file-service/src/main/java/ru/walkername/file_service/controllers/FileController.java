package ru.walkername.file_service.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.walkername.file_service.dto.FileAttachmentResponse;
import ru.walkername.file_service.dto.FileResponse;
import ru.walkername.file_service.dto.PageResponse;
import ru.walkername.file_service.security.UserPrincipal;
import ru.walkername.file_service.services.FileService;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/files")
public class FileController {

    private final FileService fileService;

    @PostMapping("/download-by-array/signed-url")
    public ResponseEntity<List<FileAttachmentResponse>> downloadByArray(
            @RequestBody List<Long> ids
    ) {
        List<FileAttachmentResponse> fileResponses = fileService.findAllByEntityTypeAndEntityIds(ids);
        return new ResponseEntity<>(fileResponses, HttpStatus.OK);
    }

    @GetMapping("/download-by-id/signed-url/{fileId}")
    public ResponseEntity<String> downloadById(
            @PathVariable("fileId") Long fileId
    ) {
        String signedUrl = fileService.downloadById(fileId);
        return new ResponseEntity<>(signedUrl, HttpStatus.OK);
    }

    @GetMapping("/download-all/signed-url")
    public ResponseEntity<PageResponse<FileResponse>> downloadAllSignedUrl(
            @RequestParam(value = "entityType") String entityType,
            @RequestParam(value = "entityId") Long entityId,
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "limit", defaultValue = "10") Integer limit,
            @RequestParam(value = "sort", defaultValue = "uploadedAt:desc") String[] sort
    ) {
        PageResponse<FileResponse> files = fileService.findAllByEntityTypeAndEntityId(entityType, entityId, page, limit, sort);
        return new ResponseEntity<>(files, HttpStatus.OK);
    }

    @PostMapping("/upload")
    public ResponseEntity<HttpStatus> upload(
            @RequestParam(value = "file") MultipartFile file,
            @RequestParam(value = "context") String context,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        fileService.upload(file, context, userPrincipal.userId());

        return ResponseEntity.ok().build();
    }

}
