package ru.walkername.rating_system.services;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import ru.walkername.rating_system.events.RatingCreated;
import ru.walkername.rating_system.events.RatingDeleted;
import ru.walkername.rating_system.events.RatingUpdated;

@Service
public class KafkaProducerService {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final NewTopic ratingCreatedTopic;
    private final NewTopic ratingUpdatedTopic;
    private final NewTopic ratingDeletedTopic;

    @Autowired
    public KafkaProducerService(
            KafkaTemplate<String, Object> kafkaTemplate,
            NewTopic ratingCreatedTopic,
            NewTopic ratingUpdatedTopic,
            NewTopic ratingDeletedTopic
    ) {
        this.kafkaTemplate = kafkaTemplate;
        this.ratingCreatedTopic = ratingCreatedTopic;
        this.ratingUpdatedTopic = ratingUpdatedTopic;
        this.ratingDeletedTopic = ratingDeletedTopic;
    }

    public void publishRatingCreated(RatingCreated ratingCreated) {
        kafkaTemplate.send(ratingCreatedTopic.name(), ratingCreated);
    }

    public void publishRatingUpdated(RatingUpdated ratingUpdated) {
        kafkaTemplate.send(ratingUpdatedTopic.name(), ratingUpdated);
    }

    public void publishRatingDeleted(RatingDeleted ratingDeleted) {
        kafkaTemplate.send(ratingDeletedTopic.name(), ratingDeleted);
    }

}
