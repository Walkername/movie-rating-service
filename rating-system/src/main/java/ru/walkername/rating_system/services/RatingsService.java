package ru.walkername.rating_system.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
import ru.walkername.rating_system.exceptions.RatingNotFoundException;
import ru.walkername.rating_system.mapper.RatingMapper;
import ru.walkername.rating_system.models.Rating;
import ru.walkername.rating_system.repositories.RatingsRepository;

import java.time.Instant;
import java.util.*;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class RatingsService {

    private final RatingsRepository ratingsRepository;
    private final KafkaProducerService kafkaProducerService;
    private final RatingMapper ratingMapper;

    public Rating findOne(Long userId, Long movieId) {
        return ratingsRepository.findByUserIdAndMovieId(userId, movieId).orElse(null);
    }

    @Transactional
    public void save(Rating rating) {
        Optional<Rating> existingRating = ratingsRepository
                .findByUserIdAndMovieId(rating.getUserId(), rating.getMovieId());

        if (existingRating.isPresent()) {
            // Update the existing rating
            Rating existing = existingRating.get();
            int oldRatingValue = existing.getRating();
            rating.setId(existing.getId());
            rating.setRatedAt(Instant.now());
            ratingsRepository.save(rating);

            registerRatingUpdatedEvent(rating, oldRatingValue);
        } else {
            // Create new rating
            rating.setRatedAt(Instant.now());
            ratingsRepository.save(rating);
            registerRatingCreatedEvent(rating);
        }
    }

    private void registerRatingCreatedEvent(Rating rating) {
        RatingCreated ratingCreated = new RatingCreated(
                rating.getUserId(),
                rating.getMovieId(),
                rating.getRating(),
                rating.getRatedAt()
        );

        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                kafkaProducerService.publishRatingCreated(ratingCreated);
            }
        });
    }

    private void registerRatingUpdatedEvent(Rating rating, int oldRating) {
        RatingUpdated ratingUpdated = new RatingUpdated(
                rating.getUserId(),
                rating.getMovieId(),
                rating.getRating(),
                oldRating,
                rating.getRatedAt()
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
                .orElseThrow(() -> {
                    log.warn("Delete attempt for non-existent rating with userId={} and movieId={}", userId, movieId);
                    return new RatingNotFoundException("Rating not found");
                });

        ratingsRepository.delete(currentRating);

        registerRatingDeletedEvent(currentRating);

        log.debug("Rating deleted successfully: userId={}, movieId={}", userId, movieId);
    }

    @Transactional
    @KafkaListener(
            topics = "movies-deleted",
            groupId = "rating-service-group",
            containerFactory = "movieDeletedContainerFactory"
    )
    public void deleteRatingsByMovieId(MovieDeleted movieDeleted) {
        // This is inefficient, so we need to make it impossible to delete the movie
        List<Rating> ratings = ratingsRepository.findByMovieId(movieDeleted.movieId());
        ratingsRepository.deleteAllByMovieId(movieDeleted.movieId());
        ratings.forEach(this::registerRatingDeletedEvent);

        log.info("All ratings by movieId deleted successfully: movieId={}", movieDeleted.movieId());
    }

    private void registerRatingDeletedEvent(Rating rating) {
        RatingDeleted ratingDeleted = new RatingDeleted(
                rating.getUserId(),
                rating.getMovieId(),
                rating.getRating()
        );

        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                kafkaProducerService.publishRatingDeleted(ratingDeleted);
            }
        });
    }

    public RatingsResponse getRatingsByUser(Long id, int page, int moviesPerPage, String[] sort) {
        Sort sorting = Sort.by(createOrders(sort));
        Pageable pageable = PageRequest.of(page, moviesPerPage, sorting);
        Page<Rating> ratings = ratingsRepository.findAllByUserId(id, pageable);

        List<RatingResponse> ratingResponses = new ArrayList<>();
        for (Rating rating : ratings.getContent()) {
            RatingResponse ratingResponse = ratingMapper.toRatingResponse(rating);
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

}
