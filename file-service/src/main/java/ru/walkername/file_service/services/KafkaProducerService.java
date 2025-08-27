package ru.walkername.file_service.services;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import ru.walkername.file_service.events.FileUploaded;

@Service
public class KafkaProducerService {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final NewTopic fileUploadedTopic;

    @Autowired
    public KafkaProducerService(KafkaTemplate<String, Object> kafkaTemplate, NewTopic fileUploadedTopic) {
        this.kafkaTemplate = kafkaTemplate;
        this.fileUploadedTopic = fileUploadedTopic;
    }

    public void publishFileUploaded(FileUploaded fileUploaded) {
        kafkaTemplate.send(fileUploadedTopic.name(), fileUploaded);
    }

}
