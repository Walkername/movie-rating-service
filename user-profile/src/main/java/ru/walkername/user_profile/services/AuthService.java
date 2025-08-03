package ru.walkername.user_profile.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.walkername.user_profile.models.RefreshToken;
import ru.walkername.user_profile.models.User;
import ru.walkername.user_profile.repositories.RefreshTokensRepository;
import ru.walkername.user_profile.repositories.UsersRepository;
import ru.walkername.user_profile.util.LoginException;
import ru.walkername.user_profile.util.RegistrationException;

import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class AuthService {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokensRepository refreshTokensRepository;

    @Autowired
    public AuthService(
            UsersRepository usersRepository,
            PasswordEncoder passwordEncoder,
            RefreshTokensRepository refreshTokensRepository) {
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
        this.refreshTokensRepository = refreshTokensRepository;
    }

    @Transactional
    public void register(User user) {
        if (usersRepository.existsById(user.getId())) {
            throw new RegistrationException("User already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");
        usersRepository.save(user);
    }

    public User checkAndGet(User user) {
        Optional<User> userOptional = usersRepository.findByUsername(user.getUsername());
        if (userOptional.isEmpty()) {
            throw new LoginException("User was not found");
        }

        User userGet = userOptional.get();

        if (!passwordEncoder.matches(user.getPassword(), userGet.getPassword())) {
            throw new LoginException("Wrong password");
        }

        return userGet;
    }

    public RefreshToken findRefreshToken(int userId) {
        Optional<RefreshToken> refreshTokenOptional = refreshTokensRepository.findByUserId(userId);
        return refreshTokenOptional.orElse(null);
    }

    @Transactional
    public void updateRefreshToken(int userId, String newRefreshToken) {
        Optional<RefreshToken> refreshToken = refreshTokensRepository.findByUserId(userId);
        // If DB does not store refresh token for this user, then
        // it just will be saved in DB
        if (refreshToken.isPresent()) {
            refreshToken.get().setRefreshToken(newRefreshToken);
        } else {
            refreshTokensRepository.save(new RefreshToken(userId, newRefreshToken));
        }
    }

}
