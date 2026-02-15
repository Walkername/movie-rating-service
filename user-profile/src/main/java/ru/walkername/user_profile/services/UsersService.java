package ru.walkername.user_profile.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.walkername.user_profile.dto.PageResponse;
import ru.walkername.user_profile.dto.UserDTO;
import ru.walkername.user_profile.dto.UserResponse;
import ru.walkername.user_profile.events.FileUploaded;
import ru.walkername.user_profile.events.RatingCreated;
import ru.walkername.user_profile.events.RatingDeleted;
import ru.walkername.user_profile.events.RatingUpdated;
import ru.walkername.user_profile.exceptions.UserExistsException;
import ru.walkername.user_profile.exceptions.UserNotFoundException;
import ru.walkername.user_profile.models.User;
import ru.walkername.user_profile.repositories.UsersRepository;
import ru.walkername.user_profile.util.UserModelMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class UsersService {

    private final UsersRepository usersRepository;
    private final UserModelMapper userModelMapper;

    private static final String USER_AVATAR = "user-avatar";

    @Cacheable(cacheNames = "user", key = "#id", unless = "#result == null")
    public User findOne(Long id) {
        return usersRepository.findById(id).orElseThrow(
                () -> new UserNotFoundException("User not found")
        );
    }

    @CacheEvict(cacheNames = "user", key = "#id")
    @Transactional
    public void delete(Long id) {
        boolean userExists = usersRepository.existsById(id);
        if (!userExists) {
            log.warn("Delete attempt for non-existent user with id={}", id);
            throw new UserNotFoundException("User not found");
        }
        usersRepository.deleteById(id);

        log.debug("User with id {} has been deleted", id);
    }

    @CacheEvict(cacheNames = "user", key = "#id")
    @Transactional
    public void update(Long id, UserDTO newUser) {
        User user = usersRepository.findById(id).orElseThrow(
                () -> {
                    log.warn("Update attempt for non-existent user with id={}", id);
                    return new UserNotFoundException("User not found");
                }
        );

        userModelMapper.convertToUser(newUser, user);

        log.debug("User with id {} has been updated", id);
    }

    @CacheEvict(cacheNames = "user", key = "#id")
    @Transactional
    public void updateUsername(Long id, String newUsername) {
        User user = usersRepository.findById(id).orElseThrow(
                () -> {
                    log.warn("Update username attempt for non-existent user with id={}", id);
                    return new UserNotFoundException("User not found");
                }
        );
        if (usersRepository.existsByUsername(newUsername)) {
            log.warn("Update username attempt for existing username with id={}", id);
            throw new UserExistsException("User with such username already exists");
        }
        user.setUsername(newUsername);

        log.debug("User username with id {} has been updated", id);
    }

    @CacheEvict(cacheNames = "user", key = "#fileUploaded.getContextId()",
            condition = "#fileUploaded.getContext() != null && #fileUploaded.getContext().equals('user-avatar')")
    @Transactional
    @KafkaListener(
            topics = "file-uploaded",
            groupId = "user-service-group",
            containerFactory = "fileUploadedContainerFactory"
    )
    public void saveProfilePicture(FileUploaded fileUploaded) {
        if (fileUploaded.getContext() != null && fileUploaded.getContext().equals(USER_AVATAR)) {
            User currentUser = usersRepository.findById(fileUploaded.getContextId())
                    .orElseThrow(() -> {
                                log.warn(
                                        "From kafka: update profile-pic-id attempt for not existing user with id={}",
                                        fileUploaded.getContextId()
                                );
                                return new UserNotFoundException("User not found");
                            }
                    );

            currentUser.setProfilePicId(fileUploaded.getFileId());
            log.debug("User (#{}) profile-pic-id has been updated on: {}", currentUser.getId(), fileUploaded.getFileId());
        } else if (fileUploaded.getContext() == null) {
            log.error("Kafka event FileUploaded context is null");
        }
    }

    @CacheEvict(cacheNames = "user", key = "#userId")
    @Transactional
    public void updateProfilePicture(Long userId, Long fileId) {
        User currentUser = usersRepository.findById(userId)
                .orElseThrow(() -> {
                            log.warn("From API: update profile-pic-id attempt for not existing user with id={}", userId);
                            return new UserNotFoundException("User not found");
                        }
                );

        currentUser.setProfilePicId(fileId);
    }

    public User findByUsername(String username) {
        return usersRepository.findByUsername(username).orElseThrow(
                () -> new UserNotFoundException("User not found")
        );
    }

    public boolean existsByUsername(String username) {
        return usersRepository.existsByUsername(username);
    }

    @Caching(evict = {
            // delete cache getTopUser()
            @CacheEvict(cacheNames = "top-user", allEntries = true),
            // delete cache findOne()
            @CacheEvict(cacheNames = "user", key = "#ratingCreated.getUserId()", condition = "#ratingCreated.getUserId() != null")
    })
    @Transactional
    @KafkaListener(
            topics = "ratings-created",
            groupId = "user-service-group",
            containerFactory = "ratingCreatedContainerFactory"
    )
    public void handleRatingCreated(RatingCreated ratingCreated) {
        Optional<User> user = usersRepository.findById(ratingCreated.getUserId());
        if (user.isEmpty()) {
            log.warn(
                    "From kafka: update avg rating (create new) attempt for non-existing user with id={}",
                    ratingCreated.getUserId()
            );
        }
        user.ifPresent(value -> {
            int newRating = ratingCreated.getRating();
            int scores = value.getScores(); // current scores
            double averageRating = value.getAverageRating(); // current average rating

            double newAverageRating = (averageRating * scores + newRating) / (scores + 1);

            value.setScores(scores + 1);
            value.setAverageRating(newAverageRating);
        });
    }

    @Caching(evict = {
            // delete cache getTopUser()
            @CacheEvict(cacheNames = "top-user", allEntries = true),
            // delete cache findOne()
            @CacheEvict(cacheNames = "user", key = "#ratingUpdated.getUserId()", condition = "#ratingUpdated.getUserId() != null")
    })
    @Transactional
    @KafkaListener(
            topics = "ratings-updated",
            groupId = "user-service-group",
            containerFactory = "ratingUpdatedContainerFactory"
    )
    public void handleRatingUpdated(RatingUpdated ratingUpdated) {
        Optional<User> user = usersRepository.findById(ratingUpdated.getUserId());
        if (user.isEmpty()) {
            log.warn(
                    "From kafka: update avg rating (update existing) attempt for non-existing user with id={}",
                    ratingUpdated.getUserId()
            );
        }
        user.ifPresent(value -> {
            int newRating = ratingUpdated.getRating();
            int oldRating = ratingUpdated.getOldRating();
            int scores = value.getScores(); // current scores
            double averageRating = value.getAverageRating(); // current average rating

            double newAverageRating = (averageRating * scores - oldRating + newRating) / scores;

            value.setAverageRating(newAverageRating);
        });
    }

    @Caching(evict = {
            // delete cache getTopUser()
            @CacheEvict(cacheNames = "top-user", allEntries = true),
            // delete cache findOne()
            @CacheEvict(cacheNames = "user", key = "#ratingDeleted.getUserId()", condition = "#ratingDeleted.getUserId() != null")
    })
    @Transactional
    @KafkaListener(
            topics = "ratings-deleted",
            groupId = "user-service-group",
            containerFactory = "ratingDeletedContainerFactory"
    )
    public void handleRatingDeleted(RatingDeleted ratingDeleted) {
        Optional<User> user = usersRepository.findById(ratingDeleted.getUserId());
        if (user.isEmpty()) {
            log.warn(
                    "From kafka: update avg rating (delete existing) attempt for non-existing user with id={}",
                    ratingDeleted.getUserId()
            );
        }
        user.ifPresent(value -> {
            int ratingToDelete = ratingDeleted.getRating();
            int scores = value.getScores();
            double averageRating = value.getAverageRating();

            int newScores = scores - 1;
            if (newScores <= 0) {
                value.setScores(0);
                value.setAverageRating(0);
            } else {
                double newAverageRating = (averageRating * scores - ratingToDelete) / (scores - 1);
                value.setScores(scores - 1);
                value.setAverageRating(newAverageRating);
            }
        });
    }

    @Cacheable(cacheNames = "top-user")
    public User getTopUser() {
        return usersRepository.findUserWithHighestScores().orElseThrow(
                () -> new UserNotFoundException("Top-user not found")
        );
    }

    public PageResponse<UserResponse> getUsersByIds(int page, int limit, List<Long> userIds) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<User> usersPage = usersRepository.findByIdIn(userIds, pageable);

        List<UserResponse> userResponses = new ArrayList<>();

        for (User user : usersPage.getContent()) {
            UserResponse userResponse = userModelMapper.convertToUserResponse(user);
            userResponses.add(userResponse);
        }

        return new PageResponse<>(
                userResponses,
                page,
                limit,
                usersPage.getTotalElements(),
                usersPage.getTotalPages()
        );
    }

}
