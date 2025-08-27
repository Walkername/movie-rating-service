package ru.walkername.file_service.controllers;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.walkername.file_service.dto.FileResponse;
import ru.walkername.file_service.services.FileService;
import ru.walkername.file_service.services.TokenService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/files")
public class FileController {

    private final FileService fileService;
    private final TokenService tokenService;

    @Autowired
    public FileController(FileService fileService, TokenService tokenService) {
        this.fileService = fileService;
        this.tokenService = tokenService;
    }

    @GetMapping("/download")
    public ResponseEntity<byte[]> download(
            @RequestParam("filename") String filename
    ) {
        byte[] file = fileService.downloadFile(filename);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(file);
    }

    @GetMapping("/download/signed-url")
    public ResponseEntity<String> downloadSignedUrl(
            @RequestParam("filename") String filename
    ) {
        return new ResponseEntity<>(
                fileService.generatePreSignedUrl(filename, 10),
                HttpStatus.OK
        );
    }

    @GetMapping("/download-by-id/signed-url/{fileId}")
    public ResponseEntity<String> downloadById(
            @PathVariable("fileId") int fileId
    ) {
        String signedUrl = fileService.downloadById(fileId);
        return signedUrl != null
                ? new ResponseEntity<>(signedUrl, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/download-all/signed-url")
    public ResponseEntity<List<FileResponse>> downloadAllSignedUrl(
            @RequestParam(value = "entityType") String entityType,
            @RequestParam(value = "entityId") int entityId
    ) {
        List<FileResponse> files = fileService.findAllByEntityTypeAndEntityId(entityType, entityId);
        return new ResponseEntity<>(files, HttpStatus.OK);
    }

    @PostMapping("/upload")
    public ResponseEntity<String> upload(
            @RequestParam(value = "file") MultipartFile file,
            @RequestParam(value = "context") String context,
            @RequestParam(value = "id") int id,
            @RequestHeader("Authorization") String authorization
    ) {
        String uniqueUrl;
        String originalFilename = file.getOriginalFilename();
        String extension = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        DecodedJWT decodedJWT;
        try {
            String token = authorization.substring(7);
            decodedJWT = tokenService.validateToken(token);
        } catch (JWTVerificationException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
        switch (context) {
            case "user", "user-avatar" -> {
                if (decodedJWT == null) {
                    return new ResponseEntity<>("Invalid context", HttpStatus.UNAUTHORIZED);
                }
                int requestId = decodedJWT.getClaim("id").asInt();
                uniqueUrl = "user-" + requestId + "/" + UUID.randomUUID() + extension;
            }

            case "movie", "movie-poster" -> {
                String role = decodedJWT.getClaim("role").asString();
                if (!role.equals("ADMIN")) {
                    return new ResponseEntity<>("Invalid authorities", HttpStatus.FORBIDDEN);
                }
                uniqueUrl = "movie-" + id + "/" + UUID.randomUUID() + extension;
            }

            default -> {
                return new ResponseEntity<>("There is no such context", HttpStatus.BAD_REQUEST);
            }
        }
        fileService.uploadFile(uniqueUrl, file, context, id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
