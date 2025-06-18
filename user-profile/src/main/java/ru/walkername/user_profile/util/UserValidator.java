package ru.walkername.user_profile.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import ru.walkername.user_profile.models.User;
import ru.walkername.user_profile.services.UsersService;

@Component
public class UserValidator implements Validator {

    private final UsersService usersService;

    @Autowired
    public UserValidator(UsersService usersService) {
        this.usersService = usersService;
    }

    @Override
    public boolean supports(Class<?> clazz) {
        return User.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        User user = (User) target;

        if (usersService.findByUsername(user.getUsername()).isPresent()) {
            errors.rejectValue("username", "", "This username is already in use");
        }
    }
}
