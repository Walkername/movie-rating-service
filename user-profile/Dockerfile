FROM openjdk:21-jdk-oracle
WORKDIR /app
COPY target/user-profile.jar /app/user-profile.jar
#EXPOSE 8080
ENTRYPOINT ["java", "-jar", "user-profile.jar"]