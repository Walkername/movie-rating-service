package ru.walkername.rating_system.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import ru.walkername.rating_system.dto.NewRatingDTO;
import ru.walkername.rating_system.models.Rating;
import ru.walkername.rating_system.repositories.RatingsRepository;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class RatingsService {

    private final RatingsRepository ratingsRepository;
    private final String MOVIE_SERVICE_API;
    private final String USER_SERVICE_API;
    private final RestTemplate restTemplate;

    @Autowired
    public RatingsService(
            RatingsRepository ratingsRepository,
            @Value("${movie.service.url}") String MOVIE_SERVICE_API,
            @Value("${user.service.url}") String USER_SERVICE_API,
            RestTemplate restTemplate) {
        this.ratingsRepository = ratingsRepository;
        this.MOVIE_SERVICE_API = MOVIE_SERVICE_API;
        this.USER_SERVICE_API = USER_SERVICE_API;
        this.restTemplate = restTemplate;
    }

    public Rating findOne(int userId, int movieId) {
        Optional<Rating> rating = ratingsRepository.findByUserIdAndMovieId(userId, movieId);
        return rating.orElse(null);
    }

    @Transactional
    public void save(Rating rating) {
        try {
            NewRatingDTO newRatingDTO = new NewRatingDTO(rating.getRating(), 0.0, false);

            // Send to User and Movie Services
            // TODO: do it with message broker, just send to Movie and User services and don't wait
            String urlToMovie = MOVIE_SERVICE_API + "/movies/update-avg-rating/" + rating.getMovieId();
            String urlToUser = USER_SERVICE_API + "/users/update-avg-rating/" + rating.getUserId();
            sendTo(urlToMovie, newRatingDTO);
            sendTo(urlToUser, newRatingDTO);

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
                NewRatingDTO newRatingDTO = new NewRatingDTO(updatedRating.getRating(), value.getRating(), true);

                // Send to User and Movie Services
                // TODO: do it with message broker, just send to Movie and User services and don't wait
                String urlToMovie = MOVIE_SERVICE_API + "/movies/update-avg-rating/" + value.getMovieId();
                String urlToUser = USER_SERVICE_API + "/users/update-avg-rating/" + value.getUserId();
                sendTo(urlToMovie, newRatingDTO);
                sendTo(urlToUser, newRatingDTO);

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

    private void sendTo(String url, NewRatingDTO newRatingDTO) throws URISyntaxException {
        URI uri = new URI(url);
        restTemplate.patchForObject(uri, newRatingDTO, String.class);
    }

}
