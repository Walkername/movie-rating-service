package ru.walkername.user_profile.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import ru.walkername.user_profile.models.User;
import ru.walkername.user_profile.repositories.UsersRepository;
import ru.walkername.user_profile.security.UserInfoDetails;

import java.util.Optional;

@Service
public class UserInfoDetailsService implements UserDetailsService {

    private final UsersRepository usersRepository;

    @Autowired
    public UserInfoDetailsService(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = usersRepository.findByUsername(username);

        if (user.isEmpty()) {
            throw new UsernameNotFoundException("User not found!");
        }

        return new UserInfoDetails(user.get());
    }
}
