FROM openjdk:21-jdk-oracle
WORKDIR /app
COPY target/rating-system.jar /app/rating-system.jar
#EXPOSE 8080
ENTRYPOINT ["java", "-jar", "rating-system.jar"]