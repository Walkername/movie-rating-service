package ru.walkername.feed_service.security;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class UserPrincipal {

    private final Long userId;

    private final String username;

    private final String role;

}
