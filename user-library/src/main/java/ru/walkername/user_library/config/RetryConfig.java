package ru.walkername.user_library.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.retry.support.RetryTemplate;

@Configuration
public class RetryConfig {

    @Bean
    public RetryTemplate retryTemplate() {
        return RetryTemplate.builder()
                .maxAttempts(10)
                .exponentialBackoff(100, 2, 1000)
                .retryOn(OptimisticLockingFailureException.class)
                .build();
    }

}
