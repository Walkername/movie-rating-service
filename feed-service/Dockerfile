FROM eclipse-temurin:25-jre
WORKDIR /app
COPY target/feed-service.jar feed-service.jar
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "feed-service.jar"]