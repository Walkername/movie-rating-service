FROM eclipse-temurin:25-jre
WORKDIR /app
COPY target/notification-service.jar notification-service.jar
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "notification-service.jar"]