package ru.walkername.rating_system.services;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import ru.walkername.rating_system.dto.NewRatingDTO;

@Service
public class KafkaProducerService {

    private final KafkaTemplate<String, NewRatingDTO> kafkaTemplate;
    private final NewTopic ratingTopic;

    @Autowired
    public KafkaProducerService(KafkaTemplate<String, NewRatingDTO> kafkaTemplate, NewTopic ratingTopic) {
        this.kafkaTemplate = kafkaTemplate;
        this.ratingTopic = ratingTopic;
    }

    public void sendRating(NewRatingDTO newRatingDTO) {
        kafkaTemplate.send(ratingTopic.name(), newRatingDTO);
    }

}
