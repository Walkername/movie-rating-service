FROM eclipse-temurin:25-jre
WORKDIR /app
COPY target/file-service.jar file-service.jar
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "file-service.jar"]