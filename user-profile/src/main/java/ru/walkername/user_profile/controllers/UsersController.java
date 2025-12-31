package ru.walkername.user_profile.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.walkername.user_profile.dto.*;
import ru.walkername.user_profile.exceptions.UserInvalidFields;
import ru.walkername.user_profile.exceptions.UserInvalidUsername;
import ru.walkername.user_profile.models.User;
import ru.walkername.user_profile.security.UserPrincipal;
import ru.walkername.user_profile.services.UsersService;
import ru.walkername.user_profile.util.DTOValidator;
import ru.walkername.user_profile.util.UserModelMapper;
import ru.walkername.user_profile.util.UserValidator;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UsersController {

    private final UsersService usersService;
    private final UserValidator userValidator;
    private final UserModelMapper userModelMapper;

    @Autowired
    public UsersController(
            UsersService usersService,
            UserValidator userValidator,
            UserModelMapper userModelMapper
    ) {
        this.usersService = usersService;
        this.userValidator = userValidator;
        this.userModelMapper = userModelMapper;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(
            @PathVariable("id") Long id
    ) {
        UserResponse userResponse = userModelMapper.convertToUserResponse(usersService.findOne(id));
        return new ResponseEntity<>(userResponse, HttpStatus.OK);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserResponse> getUserByUsername(
            @PathVariable("username") String username
    ) {
        UserResponse userResponse = userModelMapper.convertToUserResponse(usersService.findByUsername(username));
        return new ResponseEntity<>(userResponse, HttpStatus.OK);
    }

//    @GetMapping()
//    public ResponseEntity<List<UserResponse>> index() {
//        List<UserResponse> list = usersService.getAll().stream().map(userModelMapper::convertToUserResponse).toList();
//        return new ResponseEntity<>(list, HttpStatus.OK);
//    }

    @PatchMapping("/me/profile-pic")
    public ResponseEntity<String> updateProfilePic(
            @RequestParam("fileId") Long fileId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        // Check if the user who requested and updated user are the same
        // Or if the admin, then he can do what he wants
        Long userId = userPrincipal.getUserId();
        usersService.updateProfilePicture(userId, fileId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/me")
    public ResponseEntity<HttpStatus> update(
            @RequestBody @Valid UserDTO userDTO,
            BindingResult bindingResult,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        DTOValidator.validate(bindingResult, UserInvalidFields::new);

        usersService.update(userPrincipal.getUserId(), userDTO);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/me/username")
    public ResponseEntity<HttpStatus> updateUsername(
            @RequestBody @Valid UsernameDTO usernameDTO,
            BindingResult bindingResult,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        User newUser = userModelMapper.convertToUser(usernameDTO);
        // check if it has the existing username or not
        userValidator.validate(newUser, bindingResult);
        DTOValidator.validate(bindingResult, UserInvalidUsername::new);

        usersService.updateUsername(userPrincipal.getUserId(), newUser.getUsername());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/me")
    public ResponseEntity<HttpStatus> delete(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        usersService.delete(userPrincipal.getUserId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/top-user")
    public ResponseEntity<UserResponse> getTopUser() {
        UserResponse userResponse = userModelMapper.convertToUserResponse(usersService.getTopUser());
        return new ResponseEntity<>(userResponse, HttpStatus.OK);
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
