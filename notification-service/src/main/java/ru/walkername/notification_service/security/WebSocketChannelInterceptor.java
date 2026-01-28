package ru.walkername.notification_service.security;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import ru.walkername.notification_service.exceptions.InvalidJWTException;
import ru.walkername.notification_service.services.TokenService;

import java.util.Collections;
import java.util.List;

@RequiredArgsConstructor
@Component
public class WebSocketChannelInterceptor implements ChannelInterceptor {

    private final TokenService tokenService;

    @Override
    public @Nullable Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            List<String> authHeaders = accessor.getNativeHeader("Authorization");

            if (authHeaders == null || authHeaders.isEmpty()) {
                throw new InvalidJWTException("Authorization header is required");
            }

            String authHeader = authHeaders.getFirst();
            if (!authHeader.startsWith("Bearer ")) {
                throw new InvalidJWTException("Authorization header is required");
            }

            String token = authHeader.substring(7);
            authenticateToken(token, accessor);
        }

        return message;
    }

    private void authenticateToken(String token, StompHeaderAccessor accessor) {
        try {
            DecodedJWT jwt = tokenService.validateToken(token);
            String role = jwt.getClaim("role").asString();
            String username = jwt.getClaim("username").asString();
            Long userId = jwt.getClaim("id").asLong();

            UserPrincipal userPrincipal = new UserPrincipal(userId, username, role);

            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    userPrincipal,
                    null,
                    Collections.singletonList(new SimpleGrantedAuthority(role))
            );

            SecurityContextHolder.getContext().setAuthentication(auth);

            accessor.setUser(auth);

        } catch (JWTVerificationException e) {
            throw new InvalidJWTException("Invalid JWT token");
        }
    }
}
