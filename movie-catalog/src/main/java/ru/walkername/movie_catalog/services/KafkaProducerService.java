package ru.walkername.movie_catalog.services;

import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import ru.walkername.movie_catalog.events.MovieDeleted;
import ru.walkername.movie_catalog.events.MovieRatingUpdated;
import ru.walkername.movie_catalog.events.MovieUpdated;

@RequiredArgsConstructor
@Service
public class KafkaProducerService {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final NewTopic movieDeletedTopic;
    private final NewTopic movieUpdatedTopic;
    private final NewTopic movieRatingUpdatedTopic;

    public void publishMovieUpdated(MovieUpdated movieUpdated) {
        kafkaTemplate.send(movieUpdatedTopic.name(), String.valueOf(movieUpdated.id()), movieUpdated);
    }

    public void publishMovieRatingUpdated(MovieRatingUpdated movieRatingUpdated) {
        kafkaTemplate.send(movieRatingUpdatedTopic.name(), String.valueOf(movieRatingUpdated.id()), movieRatingUpdated);
    }

    public void publishMovieDeleted(MovieDeleted movieDeleted) {
        kafkaTemplate.send(movieDeletedTopic.name(), String.valueOf(movieDeleted.id()), movieDeleted);
    }
}
