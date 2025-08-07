package ru.walkername.rating_system.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.walkername.rating_system.dto.NewRatingDTO;
import ru.walkername.rating_system.models.Rating;
import ru.walkername.rating_system.repositories.RatingsRepository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class RatingsService {

    private final RatingsRepository ratingsRepository;
    private final KafkaProducerService kafkaProducerService;

    @Autowired
    public RatingsService(
            RatingsRepository ratingsRepository,
            KafkaProducerService kafkaProducerService) {
        this.ratingsRepository = ratingsRepository;
        this.kafkaProducerService = kafkaProducerService;
    }

    public Rating findOne(int userId, int movieId) {
        Optional<Rating> rating = ratingsRepository.findByUserIdAndMovieId(userId, movieId);
        return rating.orElse(null);
    }

    @Transactional
    public void save(Rating rating) {
        try {
            NewRatingDTO newRatingDTO = new NewRatingDTO(
                    rating.getUserId(),
                    rating.getMovieId(),
                    rating.getRating(),
                    0.0,
                    false
            );

            // Kafka: send to User and Movie services
            kafkaProducerService.sendRating(newRatingDTO);

            // Save to db new added rating
            rating.setDate(new Date());
            ratingsRepository.save(rating);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Transactional
    public void update(int id, Rating updatedRating) {
        Optional<Rating> oldRating = ratingsRepository.findById(id);
        oldRating.ifPresent(value -> {
            try {
                NewRatingDTO newRatingDTO = new NewRatingDTO(
                        updatedRating.getUserId(),
                        updatedRating.getMovieId(),
                        updatedRating.getRating(),
                        value.getRating(),
                        true
                );

                // Kafka: send to User and Movie services
                kafkaProducerService.sendRating(newRatingDTO);

                // Save to DB updated rating
                updatedRating.setRatingId(id);
                updatedRating.setDate(new Date());
                ratingsRepository.save(updatedRating);
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }

    @Transactional
    public void delete(int id) {
        ratingsRepository.deleteById(id);
    }

    public List<Rating> getRatingsByUser(int id, int page, int moviesPerPage, boolean byDate) {
        Sort sort = byDate
                ? Sort.by("date").descending()
                : Sort.by("date").ascending();
        return ratingsRepository.findAllByUserId(id, PageRequest.of(page, moviesPerPage, sort)).getContent();
    }

    public List<Rating> getRatingsByMovie(int id) {
        return ratingsRepository.findByMovieId(id);
    }

}
