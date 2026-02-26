package ru.walkername.user_profile.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import ru.walkername.user_profile.dto.AuthRequest;
import ru.walkername.user_profile.dto.UserRequest;
import ru.walkername.user_profile.dto.UserResponse;
import ru.walkername.user_profile.models.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User toUser(AuthRequest authRequest);

    User toUser(UserRequest userRequest);

    void toUser(User source, @MappingTarget User destination);

    UserResponse toUserResponse(User user);

}
