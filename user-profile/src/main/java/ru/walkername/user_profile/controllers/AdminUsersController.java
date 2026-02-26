package ru.walkername.user_profile.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.walkername.user_profile.dto.UserRequest;
import ru.walkername.user_profile.dto.UsernameRequest;
import ru.walkername.user_profile.mapper.UserMapper;
import ru.walkername.user_profile.models.User;
import ru.walkername.user_profile.services.UsersService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/admin/users")
@CrossOrigin
public class AdminUsersController {

    private final UsersService usersService;
    private final UserMapper userMapper;

    @PatchMapping("/{id}")
    public ResponseEntity<HttpStatus> update(
            @PathVariable("id") Long id,
            @RequestBody @Valid UserRequest userRequest
    ) {
        User user = userMapper.toUser(userRequest);

        usersService.update(id, user);

        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/username")
    public ResponseEntity<HttpStatus> updateUsername(
            @PathVariable("id") Long id,
            @RequestBody @Valid UsernameRequest usernameRequest
    ) {
        usersService.updateUsername(id, usernameRequest.username());

        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/profile-pic")
    public ResponseEntity<HttpStatus> updateProfilePic(
            @PathVariable("id") Long id,
            @RequestParam("fileId") Long fileId
    ) {
        usersService.updateProfilePicture(id, fileId);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> delete(
            @PathVariable("id") Long id
    ) {
        usersService.delete(id);

        return ResponseEntity.ok().build();
    }

}
