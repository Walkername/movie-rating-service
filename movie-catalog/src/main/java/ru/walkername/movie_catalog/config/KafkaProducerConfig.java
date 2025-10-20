package ru.walkername.movie_catalog.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JsonSerializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaProducerConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Value("${spring.kafka.movie-deleted-topic.name}")
    private String movieDeletedTopicName;

    @Value("${spring.kafka.movie-updated-topic.name}")
    private String movieUpdatedTopicName;

    @Value("${spring.kafka.movie-rating-updated-topic.name}")
    private String movieRatingUpdatedTopicName;

    @Bean
    public Map<String, Object> producerConfigs() {
        Map<String, Object> props = new HashMap<>();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        return props;
    }

    @Bean
    public ProducerFactory<String, Object> producerFactory() {
        return new DefaultKafkaProducerFactory<>(producerConfigs());
    }

    @Bean
    public KafkaTemplate<String, Object> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }

    @Bean
    public NewTopic movieUpdatedTopic() {
        return TopicBuilder.name(movieUpdatedTopicName).build();
    }

    @Bean
    public NewTopic movieRatingUpdatedTopic() {
        return TopicBuilder.name(movieRatingUpdatedTopicName).build();
    }

    @Bean
    public NewTopic movieDeletedTopic() {
        return TopicBuilder.name(movieDeletedTopicName).build();
    }

}
