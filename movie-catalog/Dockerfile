FROM eclipse-temurin:25-jre
WORKDIR /app
COPY target/movie-catalog.jar movie-catalog.jar
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "movie-catalog.jar"]