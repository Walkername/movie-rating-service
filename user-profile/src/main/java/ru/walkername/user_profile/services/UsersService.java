package ru.walkername.user_profile.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import ru.walkername.user_profile.dto.RatingsResponse;
import ru.walkername.user_profile.dto.UserDetails;
import ru.walkername.user_profile.events.RatingCreated;
import ru.walkername.user_profile.events.RatingDeleted;
import ru.walkername.user_profile.events.RatingUpdated;
import ru.walkername.user_profile.models.Rating;
import ru.walkername.user_profile.models.User;
import ru.walkername.user_profile.repositories.UsersRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class UsersService {

    private final UsersRepository usersRepository;

    private final String RATING_SERVICE_API;

    private final RestTemplate restTemplate;

    @Autowired
    public UsersService(
            UsersRepository usersRepository,
            @Value("${rating.service.url}") String RATING_SERVICE_API,
            RestTemplate restTemplate
    ) {
        this.usersRepository = usersRepository;
        this.RATING_SERVICE_API = RATING_SERVICE_API;
        this.restTemplate = restTemplate;
    }

    @Cacheable(cacheNames = "user", key = "#id", unless = "#result == null")
    public User findOne(int id) {
        Optional<User> user = usersRepository.findById(id);
        return user.orElse(null);
    }

    @Transactional
    public void save(User user) {
        usersRepository.save(user);
    }

    @CacheEvict(cacheNames = "user", key = "#id")
    @Transactional
    public void delete(int id) {
        usersRepository.deleteById(id);
    }

    @CacheEvict(cacheNames = "user", key = "#id")
    @Transactional
    public void update(int id, User user) {
        user.setId(id);
        usersRepository.save(user);
    }

    @Transactional
    public void saveProfilePicture(int userId, int fileId) {
        Optional<User> currentUser = usersRepository.findById(userId);
        currentUser.ifPresent(user -> user.setProfilePicId(fileId));
    }

    public List<User> getAll() {
        return usersRepository.findAll();
    }

    public Optional<User> findByUsername(String username) {
        return usersRepository.findByUsername(username);
    }

    public List<UserDetails> getUsersByMovie(int id) {
        String url = RATING_SERVICE_API + "/ratings/movie/" + id;

        RatingsResponse ratingsResponse = restTemplate.getForObject(url, RatingsResponse.class);
        List<Rating> ratings = Objects.requireNonNull(ratingsResponse).getRatings();
        List<Integer> userIds = new ArrayList<>();
        if (ratings != null) {
            for (Rating rating : ratings) {
                userIds.add(rating.getUserId());
            }
        }

        List<UserDetails> usersByMovie = new ArrayList<>();
        List<User> users = usersRepository.findAllById(userIds);
        // TODO: improve algorithm, because this will be very slow with big amount of data
        if (ratings != null) {
            for (Rating rating : ratings) {
                for (User user : users) {
                    if (rating.getUserId() == user.getId()) {
                        UserDetails userDetails = new UserDetails(user, rating);
                        usersByMovie.add(userDetails);
                    }
                }
            }
        }

        return usersByMovie;
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
        Optional<User> user = usersRepository.findUserWithHighestScores();
        return user.orElse(null);
    }

}
