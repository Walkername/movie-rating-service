FROM eclipse-temurin:25-jre
WORKDIR /app
COPY target/rating-system.jar rating-system.jar
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "rating-system.jar"]