package ru.walkername.user_profile.controllers;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.walkername.user_profile.dto.UserDTO;
import ru.walkername.user_profile.dto.UsernameDTO;
import ru.walkername.user_profile.exceptions.UserInvalidFields;
import ru.walkername.user_profile.exceptions.UserInvalidUsername;
import ru.walkername.user_profile.models.User;
import ru.walkername.user_profile.services.UsersService;
import ru.walkername.user_profile.util.DTOValidator;
import ru.walkername.user_profile.util.UserModelMapper;
import ru.walkername.user_profile.util.UserValidator;

@RestController
@RequestMapping("/admin/users")
public class AdminUsersController {

    private final UserModelMapper userModelMapper;
    private final UsersService usersService;
    private final UserValidator userValidator;

    public AdminUsersController(UserModelMapper userModelMapper, UsersService usersService, UserValidator userValidator) {
        this.userModelMapper = userModelMapper;
        this.usersService = usersService;
        this.userValidator = userValidator;
    }

    @PatchMapping("/{id}")
    public ResponseEntity<HttpStatus> update(
        @PathVariable("id") Long id,
        @RequestBody UserDTO userDTO,
        BindingResult bindingResult
    ) {
        DTOValidator.validate(bindingResult, UserInvalidFields::new);

        usersService.update(id, userDTO);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/username")
    public ResponseEntity<HttpStatus> updateUsername(
            @PathVariable("id") Long id,
            @RequestBody @Valid UsernameDTO usernameDTO,
            BindingResult bindingResult
    ) {
        User newUser = userModelMapper.convertToUser(usernameDTO);
        // check if it has the existing username or not
        userValidator.validate(newUser, bindingResult);
        DTOValidator.validate(bindingResult, UserInvalidUsername::new);

        usersService.updateUsername(id, newUser.getUsername());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<HttpStatus> delete(
            @PathVariable("id") Long id
    ) {
        usersService.delete(id);
        return ResponseEntity.ok().build();
    }

}
