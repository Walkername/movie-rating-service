package ru.walkername.rating_system.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.walkername.rating_system.dto.PageResponse;
import ru.walkername.rating_system.dto.RatingResponse;
import ru.walkername.rating_system.events.RatingCreated;
import ru.walkername.rating_system.events.RatingDeleted;
import ru.walkername.rating_system.events.RatingUpdated;
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
            KafkaProducerService kafkaProducerService, RatingModelMapper ratingModelMapper) {
        this.ratingsRepository = ratingsRepository;
        this.kafkaProducerService = kafkaProducerService;
        this.ratingModelMapper = ratingModelMapper;
    }

    public Rating findOne(Long userId, Long movieId) {
        Optional<Rating> rating = ratingsRepository.findByUserIdAndMovieId(userId, movieId);
        return rating.orElse(null);
    }

    @Transactional
    public void save(Rating rating) {
        try {
            RatingCreated ratingCreated = new RatingCreated(
                    rating.getUserId(),
                    rating.getMovieId(),
                    rating.getRating()
            );

            // Kafka: send to User and Movie services
            kafkaProducerService.publishRatingCreated(ratingCreated);

            // Save to db new added rating
            rating.setRatedAt(new Date());
            ratingsRepository.save(rating);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Transactional
    public void update(Long id, Rating updatedRating) {
        Optional<Rating> oldRating = ratingsRepository.findById(id);
        oldRating.ifPresent(value -> {
            try {
                RatingUpdated ratingUpdated = new RatingUpdated(
                        updatedRating.getUserId(),
                        updatedRating.getMovieId(),
                        updatedRating.getRating(),
                        value.getRating()
                );

                // Kafka: send to User and Movie services
                kafkaProducerService.publishRatingUpdated(ratingUpdated);

                // Save to DB updated rating
                updatedRating.setRatingId(id);
                updatedRating.setRatedAt(new Date());
                ratingsRepository.save(updatedRating);
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }

    @Transactional
    public void delete(Long id) {
        Optional<Rating> currentRating = ratingsRepository.findById(id);
        currentRating.ifPresent(value -> {
            try {
                RatingDeleted ratingDeleted = new RatingDeleted(
                        value.getUserId(),
                        value.getMovieId(),
                        value.getRating()
                );

                kafkaProducerService.publishRatingDeleted(ratingDeleted);

                ratingsRepository.deleteById(id);
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }

    public PageResponse<RatingResponse> getRatingsByUser(Long id, int page, int moviesPerPage, String[] sort) {
        Sort sorting = Sort.by(createOrders(sort));
        Pageable pageable = PageRequest.of(page, moviesPerPage, sorting);
        Page<Rating> ratings = ratingsRepository.findAllByUserId(id, pageable);

        List<RatingResponse> ratingResponses = new ArrayList<>();
        for (Rating rating : ratings.getContent()) {
            RatingResponse ratingResponse = ratingModelMapper.convertToRatingResponse(rating);
            ratingResponses.add(ratingResponse);
        }

        return new PageResponse<>(
                ratingResponses,
                page,
                moviesPerPage,
                ratings.getTotalElements(),
                ratings.getTotalPages()
        );
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
