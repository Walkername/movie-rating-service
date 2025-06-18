package ru.walkername.user_profile.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.walkername.user_profile.models.User;
import ru.walkername.user_profile.repositories.UsersRepository;
import ru.walkername.user_profile.util.LoginException;
import ru.walkername.user_profile.util.RegistrationException;

import java.util.Optional;

@Service
public class AuthService {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(
            UsersRepository usersRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void register(User user) {
        if (usersRepository.existsById(user.getId())) {
            throw new RegistrationException("User already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");
        usersRepository.save(user);
    }

    public void check(User user) {
        Optional<User> userOptional = usersRepository.findByUsername(user.getUsername());
        if (userOptional.isEmpty()) {
            throw new LoginException("User was not found");
        }

        User userGet = userOptional.get();

        if (!passwordEncoder.matches(user.getPassword(), userGet.getPassword())) {
            throw new LoginException("Wrong password");
        }
    }

}
