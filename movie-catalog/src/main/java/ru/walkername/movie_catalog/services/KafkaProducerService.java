package ru.walkername.movie_catalog.services;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import ru.walkername.movie_catalog.events.MovieDeleted;

@Service
public class KafkaProducerService {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final NewTopic movieDeletedTopic;

    @Autowired
    public KafkaProducerService(
            KafkaTemplate<String, Object> kafkaTemplate,
            NewTopic movieDeletedTopic
    ) {
        this.kafkaTemplate = kafkaTemplate;
        this.movieDeletedTopic = movieDeletedTopic;
    }

    public void publishMovieDeleted(MovieDeleted movieDeleted) {
        kafkaTemplate.send(movieDeletedTopic.name(), movieDeleted);
    }
}
