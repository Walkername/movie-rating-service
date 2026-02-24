package ru.walkername.movie_catalog.security;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import ru.walkername.movie_catalog.exceptions.InvalidJWTException;
import ru.walkername.movie_catalog.services.TokenService;

import java.io.IOException;
import java.util.Collections;

@RequiredArgsConstructor
@Component
public class JWTFilter extends OncePerRequestFilter {

    private final TokenService tokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.length() == 6) {
            authHeader = authHeader + " ";
        }

        if (authHeader != null && !authHeader.isBlank() && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            if (token.isBlank()) {
                throw new InvalidJWTException("Invalid JWT token");
            } else {
                try {
                    DecodedJWT jwt = tokenService.validateToken(token);
                    String role = jwt.getClaim("role").asString();
                    String username = jwt.getClaim("username").asString();
                    Long userId = jwt.getClaim("id").asLong();

                    UserPrincipal userPrincipal = new UserPrincipal(userId, username, role);

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userPrincipal,
                            "",
                            Collections.singletonList(new SimpleGrantedAuthority(role))
                    );

                    if (SecurityContextHolder.getContext().getAuthentication() == null) {
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                } catch (JWTVerificationException e) {
                    throw new InvalidJWTException("Invalid JWT token");
                }

            }
        }

        filterChain.doFilter(request, response);
    }

}
