package ru.walkername.rating_system.services;

import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import ru.walkername.rating_system.events.RatingCreated;
import ru.walkername.rating_system.events.RatingDeleted;
import ru.walkername.rating_system.events.RatingUpdated;

@RequiredArgsConstructor
@Service
public class KafkaProducerService {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final NewTopic ratingCreatedTopic;
    private final NewTopic ratingUpdatedTopic;
    private final NewTopic ratingDeletedTopic;

    public void publishRatingCreated(RatingCreated ratingCreated) {
        kafkaTemplate.send(ratingCreatedTopic.name(), String.valueOf(ratingCreated.movieId()), ratingCreated);
    }

    public void publishRatingUpdated(RatingUpdated ratingUpdated) {
        kafkaTemplate.send(ratingUpdatedTopic.name(), String.valueOf(ratingUpdated.movieId()), ratingUpdated);
    }

    public void publishRatingDeleted(RatingDeleted ratingDeleted) {
        kafkaTemplate.send(ratingDeletedTopic.name(), String.valueOf(ratingDeleted.movieId()), ratingDeleted);
    }

}
