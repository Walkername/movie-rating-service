package ru.walkername.file_service.services;

import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import ru.walkername.file_service.events.FileUploaded;

@RequiredArgsConstructor
@Service
public class KafkaProducerService {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final NewTopic fileUploadedTopic;

    public void publishFileUploaded(FileUploaded fileUploaded) {
        kafkaTemplate.send(fileUploadedTopic.name(), fileUploaded);
    }

}
