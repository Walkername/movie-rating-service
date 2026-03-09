package ru.walkername.file_service.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import ru.walkername.file_service.services.AdminFileService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/admin/files")
public class AdminFileController {

    private final AdminFileService adminFileService;

    @PostMapping("/upload")
    public ResponseEntity<HttpStatus> upload(
            @RequestParam(value = "file") MultipartFile file,
            @RequestParam(value = "context") String context,
            @RequestParam(value = "id") Long contextId
    ) {
        adminFileService.upload(file, context, contextId);

        return ResponseEntity.ok().build();
    }

}
