package ru.walkername.rating_system.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import ru.walkername.rating_system.dto.PageResponse;
import ru.walkername.rating_system.dto.RatingResponse;
import ru.walkername.rating_system.dto.RatingsResponse;
import ru.walkername.rating_system.events.MovieDeleted;
import ru.walkername.rating_system.events.RatingCreated;
import ru.walkername.rating_system.events.RatingDeleted;
import ru.walkername.rating_system.events.RatingUpdated;
import ru.walkername.rating_system.exceptions.RatingNotFound;
import ru.walkername.rating_system.models.Rating;
import ru.walkername.rating_system.repositories.RatingsRepository;
import ru.walkername.rating_system.utils.RatingModelMapper;

import java.util.*;

@Service
@Transactional(readOnly = true)
public class RatingsService {

    private final RatingsRepository ratingsRepository;
    private final KafkaProducerService kafkaProducerService;
    private final RatingModelMapper ratingModelMapper;

    @Autowired
    public RatingsService(
            RatingsRepository ratingsRepository,
            KafkaProducerService kafkaProducerService,
            RatingModelMapper ratingModelMapper
    ) {
        this.ratingsRepository = ratingsRepository;
        this.kafkaProducerService = kafkaProducerService;
        this.ratingModelMapper = ratingModelMapper;
    }

    public Rating findOne(Long userId, Long movieId) {
        Optional<Rating> rating = ratingsRepository.findByUserIdAndMovieId(userId, movieId);
        return rating.orElse(null);
    }

    public boolean existsByUserIdAndMovieId(Long userId, Long movieId) {
        return ratingsRepository.existsByUserIdAndMovieId(userId, movieId);
    }

    @Transactional
    public void save(Rating rating) {
        // Save to db new added rating
        rating.setRatedAt(new Date());
        ratingsRepository.save(rating);

        // Kafka: send to User and Movie services
        registerRatingCreatedEvent(rating.getUserId(), rating.getMovieId(), rating.getRating());
    }

    private void registerRatingCreatedEvent(Long userId, Long movieId, int rating) {
        RatingCreated ratingCreated = new RatingCreated(
                userId,
                movieId,
                rating
        );

        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                kafkaProducerService.publishRatingCreated(ratingCreated);
            }
        });
    }

    @Transactional
    public void update(Rating updatedRating) {
        // Getting user's rating
        // userId from UserPrincipal, so
        // you can't get rating other people, manually typing userId, and update it
        Rating oldRating = ratingsRepository
                .findByUserIdAndMovieId(updatedRating.getUserId(), updatedRating.getMovieId())
                .orElseThrow(() -> new RatingNotFound("Rating not found"));

        int oldRatingValue = oldRating.getRating();
        // Save to DB updated rating
        updatedRating.setRatingId(oldRating.getRatingId());
        updatedRating.setRatedAt(new Date());
        ratingsRepository.save(updatedRating);

        // Kafka: send to User and Movie services
        registerRatingUpdatedEvent(
                updatedRating.getUserId(),
                updatedRating.getMovieId(),
                updatedRating.getRating(),
                oldRatingValue
        );
    }

    private void registerRatingUpdatedEvent(Long userId, Long movieId, int newRating, int oldRating) {
        RatingUpdated ratingUpdated = new RatingUpdated(
                userId,
                movieId,
                newRating,
                oldRating
        );

        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                kafkaProducerService.publishRatingUpdated(ratingUpdated);
            }
        });
    }

    @Transactional
    public void delete(Long movieId, Long userId) {
        Rating currentRating = ratingsRepository
                .findByUserIdAndMovieId(userId, movieId)
                .orElseThrow(() -> new RatingNotFound("Rating not found"));

        ratingsRepository.delete(currentRating);

        registerRatingDeletedEvent(
                currentRating.getUserId(),
                currentRating.getMovieId(),
                currentRating.getRating()
        );
    }

    private void registerRatingDeletedEvent(Long userId, Long movieId, int rating) {
        RatingDeleted ratingDeleted = new RatingDeleted(
                userId,
                movieId,
                rating
        );

        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                kafkaProducerService.publishRatingDeleted(ratingDeleted);
            }
        });
    }

    @Transactional
    @KafkaListener(
            topics = "movies-deleted",
            groupId = "rating-service-group",
            containerFactory = "movieDeletedContainerFactory"
    )
    public void deleteRatingsByMovieId(MovieDeleted movieDeleted) {
        // This is inefficient, so we need to make it impossible to delete the movie
        List<Rating> ratings = ratingsRepository.findByMovieId(movieDeleted.getMovieId());
        ratingsRepository.deleteAllByMovieId(movieDeleted.getMovieId());
        ratings.forEach(rating ->
                registerRatingDeletedEvent(
                        rating.getUserId(),
                        movieDeleted.getMovieId(),
                        rating.getRating()
                )
        );
    }

    public RatingsResponse getRatingsByUser(Long id, int page, int moviesPerPage, String[] sort) {
        Sort sorting = Sort.by(createOrders(sort));
        Pageable pageable = PageRequest.of(page, moviesPerPage, sorting);
        Page<Rating> ratings = ratingsRepository.findAllByUserId(id, pageable);

        List<RatingResponse> ratingResponses = new ArrayList<>();
        for (Rating rating : ratings.getContent()) {
            RatingResponse ratingResponse = ratingModelMapper.convertToRatingResponse(rating);
            ratingResponses.add(ratingResponse);
        }

        PageResponse<RatingResponse> pageResponse = new PageResponse<>(
                ratingResponses,
                page,
                moviesPerPage,
                ratings.getTotalElements(),
                ratings.getTotalPages()
        );
        return new RatingsResponse(pageResponse);
    }

    private List<Sort.Order> createOrders(String[] sort) {
        return Arrays.stream(sort).map(this::parseSort).toList();
    }

    private Sort.Order parseSort(String sortParam) {
        String[] parts = sortParam.split(":");
        String property = parts[0];
        Sort.Direction direction = parts.length > 1 ? Sort.Direction.fromString(parts[1]) : Sort.Direction.DESC;
        return new Sort.Order(direction, property);
    }

    public List<Rating> getRatingsByMovie(Long id) {
        return ratingsRepository.findByMovieId(id);
    }

}
