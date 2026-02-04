package ru.walkername.conversation_service.security;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class UserPrincipal {

    private final Long userId;

    private final String username;

    private final String role;

}
