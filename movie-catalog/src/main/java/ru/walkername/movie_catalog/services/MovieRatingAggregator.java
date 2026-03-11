package ru.walkername.movie_catalog.services;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import ru.walkername.movie_catalog.events.MovieRatingUpdated;
import ru.walkername.movie_catalog.models.Movie;
import ru.walkername.movie_catalog.repositories.MoviesRepository;

import java.util.Optional;
import java.util.Set;

@RequiredArgsConstructor
@Service
public class MovieRatingAggregator {

    private final MovieRatingUpdateBuffer buffer;
    private final MoviesRepository moviesRepository;
    private final KafkaProducerService kafkaProducerService;

    @Scheduled(fixedDelay = 60000)
    public void processDirtyMovies() {
        Set<Long> movieIds = buffer.drainDirtyMovies();

        for (Long movieId : movieIds) {
            Optional<Movie> optionalMovie = moviesRepository.findById(movieId);
            optionalMovie.ifPresent(movie -> {
                MovieRatingUpdated movieRatingUpdated = new MovieRatingUpdated(
                        movie.getId(),
                        movie.getAverageRating(),
                        movie.getScores()
                );

                kafkaProducerService.publishMovieRatingUpdated(movieRatingUpdated);
            });
        }
    }

}
