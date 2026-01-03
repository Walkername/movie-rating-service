package ru.walkername.user_profile;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import ru.walkername.user_profile.controllers.UsersController;
import ru.walkername.user_profile.dto.*;
import ru.walkername.user_profile.models.User;
import ru.walkername.user_profile.services.UsersService;
import ru.walkername.user_profile.util.UserModelMapper;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UsersControllerTest {

    @Mock
    private UsersService usersService;

    @Mock
    private UserModelMapper userModelMapper;

    @InjectMocks
    private UsersController usersController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetUser_whenUserExists() {
        User user = new User();
        user.setId(1L);
        UserResponse response = new UserResponse();
        response.setId(1L);

        when(usersService.findOne(1L)).thenReturn(user);
        when(userModelMapper.convertToUserResponse(user)).thenReturn(response);

        UserResponse userResponse = usersController.getUser(1L).getBody();
        assertNotNull(userResponse);
        assertEquals(1L, userResponse.getId());
    }

    @Test
    void testGetUserByUsername_whenUserExists() {
        User user = new User();
        user.setId(2L);
        UserResponse response = new UserResponse();
        response.setId(2L);

        when(usersService.findByUsername("jane")).thenReturn(user);
        when(userModelMapper.convertToUserResponse(user)).thenReturn(response);

        UserResponse userResponse = usersController.getUserByUsername("jane").getBody();
        assertNotNull(userResponse);
        assertEquals(2, userResponse.getId());
    }

}

