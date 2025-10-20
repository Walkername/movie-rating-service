package ru.walkername.user_library.config;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import ru.walkername.user_library.events.*;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaConsumerConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Bean
    public ConsumerFactory<String, RatingCreated> ratingCreatedFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "user-library-service-group");
        props.put(JsonDeserializer.TRUSTED_PACKAGES, "ru.walkername.user_library.events");
        props.put(JsonDeserializer.USE_TYPE_INFO_HEADERS, false);

        return new DefaultKafkaConsumerFactory<>(
                props,
                new StringDeserializer(),
                new JsonDeserializer<>(RatingCreated.class)
        );
    }

    @Bean
    public ConsumerFactory<String, RatingUpdated> ratingUpdatedFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "user-library-service-group");
        props.put(JsonDeserializer.TRUSTED_PACKAGES, "ru.walkername.user_library.events");
        props.put(JsonDeserializer.USE_TYPE_INFO_HEADERS, false);

        return new DefaultKafkaConsumerFactory<>(
                props,
                new StringDeserializer(),
                new JsonDeserializer<>(RatingUpdated.class)
        );
    }

    @Bean
    public ConsumerFactory<String, RatingDeleted> ratingDeletedFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "user-library-service-group");
        props.put(JsonDeserializer.TRUSTED_PACKAGES, "ru.walkername.user_library.events");
        props.put(JsonDeserializer.USE_TYPE_INFO_HEADERS, false);

        return new DefaultKafkaConsumerFactory<>(
                props,
                new StringDeserializer(),
                new JsonDeserializer<>(RatingDeleted.class)
        );
    }

    @Bean
    public ConsumerFactory<String, MovieUpdated> movieUpdatedFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "user-library-service-group");
        props.put(JsonDeserializer.TRUSTED_PACKAGES, "ru.walkername.user_library.events");
        props.put(JsonDeserializer.USE_TYPE_INFO_HEADERS, false);

        return new DefaultKafkaConsumerFactory<>(
                props,
                new StringDeserializer(),
                new JsonDeserializer<>(MovieUpdated.class)
        );
    }

    @Bean
    public ConsumerFactory<String, MovieRatingUpdated> movieRatingUpdatedFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "user-library-service-group");
        props.put(JsonDeserializer.TRUSTED_PACKAGES, "ru.walkername.user_library.events");
        props.put(JsonDeserializer.USE_TYPE_INFO_HEADERS, false);

        return new DefaultKafkaConsumerFactory<>(
                props,
                new StringDeserializer(),
                new JsonDeserializer<>(MovieRatingUpdated.class)
        );
    }

    @Bean
    public ConsumerFactory<String, MovieDeleted> movieDeletedFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "user-library-service-group");
        props.put(JsonDeserializer.TRUSTED_PACKAGES, "ru.walkername.user_library.events");
        props.put(JsonDeserializer.USE_TYPE_INFO_HEADERS, false);

        return new DefaultKafkaConsumerFactory<>(
                props,
                new StringDeserializer(),
                new JsonDeserializer<>(MovieDeleted.class)
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, RatingCreated> ratingCreatedContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, RatingCreated> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(ratingCreatedFactory());
        return factory;
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, RatingUpdated> ratingUpdatedContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, RatingUpdated> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(ratingUpdatedFactory());
        return factory;
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, RatingDeleted> ratingDeletedContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, RatingDeleted> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(ratingDeletedFactory());
        return factory;
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, MovieUpdated> movieUpdatedContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, MovieUpdated> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(movieUpdatedFactory());
        return factory;
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, MovieRatingUpdated> movieRatingUpdatedContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, MovieRatingUpdated> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(movieRatingUpdatedFactory());
        return factory;
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, MovieDeleted> movieDeletedContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, MovieDeleted> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(movieDeletedFactory());
        return factory;
    }

}
