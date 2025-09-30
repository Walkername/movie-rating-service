package ru.walkername.file_service.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.walkername.file_service.dto.FileResponse;
import ru.walkername.file_service.exceptions.InvalidUploadContextException;
import ru.walkername.file_service.security.UserPrincipal;
import ru.walkername.file_service.services.FileService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/files")
public class FileController {

    private final FileService fileService;

    @Autowired
    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

//    @GetMapping("/download")
//    public ResponseEntity<byte[]> download(
//            @RequestParam("filename") String filename
//    ) {
//        byte[] file = fileService.downloadFile(filename);
//        return ResponseEntity.ok()
//                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
//                .body(file);
//    }

//    @GetMapping("/download/signed-url")
//    public ResponseEntity<String> downloadSignedUrl(
//            @RequestParam("filename") String filename
//    ) {
//        return new ResponseEntity<>(
//                fileService.generatePreSignedUrl(filename, 10),
//                HttpStatus.OK
//        );
//    }

    @GetMapping("/download-by-id/signed-url/{fileId}")
    public ResponseEntity<String> downloadById(
            @PathVariable("fileId") Long fileId
    ) {
        String signedUrl = fileService.downloadById(fileId);
        return signedUrl != null
                ? new ResponseEntity<>(signedUrl, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/download-all/signed-url")
    public ResponseEntity<List<FileResponse>> downloadAllSignedUrl(
            @RequestParam(value = "entityType") String entityType,
            @RequestParam(value = "entityId") Long entityId
    ) {
        List<FileResponse> files = fileService.findAllByEntityTypeAndEntityId(entityType, entityId);
        return new ResponseEntity<>(files, HttpStatus.OK);
    }

    @PostMapping("/upload")
    public ResponseEntity<HttpStatus> upload(
            @RequestParam(value = "file") MultipartFile file,
            @RequestParam(value = "context") String context,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        if (!context.equals("user") && !context.equals("user-avatar")) {
            throw new InvalidUploadContextException("There is no such context");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        Long authId = userPrincipal.getUserId();
        String transformedContext = context.replaceAll("-.*", "");
        String uniqueUrl = transformedContext + "-" + authId + "/" + UUID.randomUUID() + extension;

        fileService.uploadFile(uniqueUrl, file, context, authId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
