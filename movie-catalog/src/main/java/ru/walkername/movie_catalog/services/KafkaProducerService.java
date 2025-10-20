package ru.walkername.movie_catalog.services;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import ru.walkername.movie_catalog.events.MovieDeleted;
import ru.walkername.movie_catalog.events.MovieRatingUpdated;
import ru.walkername.movie_catalog.events.MovieUpdated;

@Service
public class KafkaProducerService {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final NewTopic movieDeletedTopic;
    private final NewTopic movieUpdatedTopic;
    private final NewTopic movieRatingUpdatedTopic;

    @Autowired
    public KafkaProducerService(
            KafkaTemplate<String, Object> kafkaTemplate,
            NewTopic movieDeletedTopic,
            NewTopic movieUpdatedTopic,
            NewTopic movieRatingUpdatedTopic
    ) {
        this.kafkaTemplate = kafkaTemplate;
        this.movieDeletedTopic = movieDeletedTopic;
        this.movieUpdatedTopic = movieUpdatedTopic;
        this.movieRatingUpdatedTopic = movieRatingUpdatedTopic;
    }

    public void publishMovieUpdated(MovieUpdated movieUpdated) {
        kafkaTemplate.send(movieUpdatedTopic.name(), movieUpdated);
    }

    public void publishMovieRatingUpdated(MovieRatingUpdated movieRatingUpdated) {
        kafkaTemplate.send(movieRatingUpdatedTopic.name(), movieRatingUpdated);
    }

    public void publishMovieDeleted(MovieDeleted movieDeleted) {
        kafkaTemplate.send(movieDeletedTopic.name(), movieDeleted);
    }
}
