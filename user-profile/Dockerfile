FROM eclipse-temurin:25-jre
WORKDIR /app
COPY target/user-profile.jar user-profile.jar
#EXPOSE 8080
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "user-profile.jar"]