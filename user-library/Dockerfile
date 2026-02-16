FROM eclipse-temurin:25-jre
WORKDIR /app
COPY target/user-library.jar user-library.jar
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "user-library.jar"]