package ru.walkername.user_profile.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.walkername.user_profile.dto.*;
import ru.walkername.user_profile.mapper.UserMapper;
import ru.walkername.user_profile.models.User;
import ru.walkername.user_profile.security.UserPrincipal;
import ru.walkername.user_profile.services.UsersService;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/users")
@CrossOrigin
public class UsersController {

    private final UsersService usersService;
    private final UserMapper userMapper;

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(
            @PathVariable("id") Long id
    ) {
        User dbUser = usersService.findOne(id);

        UserResponse userResponse = userMapper.toUserResponse(dbUser);

        return new ResponseEntity<>(userResponse, HttpStatus.OK);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserResponse> getUserByUsername(
            @PathVariable("username") String username
    ) {
        User dbUser = usersService.findByUsername(username);

        UserResponse userResponse = userMapper.toUserResponse(dbUser);

        return new ResponseEntity<>(userResponse, HttpStatus.OK);
    }

    @PatchMapping("/me/profile-pic")
    public ResponseEntity<HttpStatus> updateProfilePic(
            @RequestParam("fileId") Long fileId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Long userId = userPrincipal.userId();
        usersService.updateProfilePicture(userId, fileId);

        return ResponseEntity.ok().build();
    }

    @PatchMapping("/me")
    public ResponseEntity<HttpStatus> update(
            @RequestBody @Valid UserRequest userRequest,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        User user = userMapper.toUser(userRequest);

        usersService.update(userPrincipal.userId(), user);

        return ResponseEntity.ok().build();
    }

    @PatchMapping("/me/username")
    public ResponseEntity<HttpStatus> updateUsername(
            @RequestBody @Valid UsernameRequest usernameRequest,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        usersService.updateUsername(userPrincipal.userId(), usernameRequest.username());

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/me")
    public ResponseEntity<HttpStatus> delete(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        usersService.delete(userPrincipal.userId());

        return ResponseEntity.ok().build();
    }

    @PostMapping("/batch")
    public ResponseEntity<PageResponse<UserResponse>> getUsersByIds(
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "limit", defaultValue = "5") Integer limit,
            @RequestBody List<Long> userIds
    ) {
        PageResponse<UserResponse> pageResponse = usersService.getUsersByIds(page, limit, userIds);

        return new ResponseEntity<>(pageResponse, HttpStatus.OK);
    }

}
