package ru.walkername.user_profile.util;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.walkername.user_profile.dto.AuthDTO;
import ru.walkername.user_profile.dto.UserDTO;
import ru.walkername.user_profile.dto.UserResponse;
import ru.walkername.user_profile.dto.UsernameDTO;
import ru.walkername.user_profile.models.User;

@Component
public class UserModelMapper {

    private final ModelMapper modelMapper;

    @Autowired
    public UserModelMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public User convertToUser(UsernameDTO usernameDTO) {
        return modelMapper.map(usernameDTO, User.class);
    }

    public void convertToUser(UserDTO userDTO, User userToUpdate) {
        modelMapper.map(userDTO, userToUpdate);
    }

    public User convertToUser(AuthDTO authDTO) {
        return modelMapper.map(authDTO, User.class);
    }

    public User convertToUser(UserDTO userDTO) {
        return modelMapper.map(userDTO, User.class);
    }

    public UserResponse convertToUserResponse(User user) {
        return modelMapper.map(user, UserResponse.class);
    }

}
