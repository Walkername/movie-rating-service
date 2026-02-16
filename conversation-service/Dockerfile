FROM eclipse-temurin:25-jre
WORKDIR /app
COPY target/conversation-service.jar conversation-service.jar
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "conversation-service.jar"]