package ru.walkername.feed_service.services;

import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import ru.walkername.feed_service.events.PostCreated;

@RequiredArgsConstructor
@Service
public class KafkaProducerService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    private final NewTopic postCreatedTopic;

    public void publishPostCreated(PostCreated postCreated) {
        kafkaTemplate.send(postCreatedTopic.name(), postCreated);
    }

}
