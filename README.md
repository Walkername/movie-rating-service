# Movie Rating Service 🎬⭐

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Movie Rating Service** is a microservices-based application for managing movies, ratings, users, and files.
The project is built with **Spring Boot**, **PostgreSQL**, **Kafka**, **Redis**, **Elasticsearch**, **MinIO**, and includes a **React** web frontend.

---

## 📁 Project Structure

```text
movie-rating-service/
├─ .github/workflows/
│  └─ main.yml              # CI/CD GitHub Actions configuration
├─ docker-compose.yml       # Configuration of all services
├─ prometheus.yml           # Prometheus configuration
├─ filebeat.yml             # Filebeat configuration
├─ k8s/                     # Kubernetes configuration (incomplete) 
├─ nginx/
│  └─ nginx.conf            # Nginx configuration
├─ user-profile/            # User profile service
├─ movie-catalog/           # Movie catalog service
├─ rating-system/           # Rating system service
├─ file-service/            # File management service
├─ user-library/            # User library service
├─ feed-service/            # Activity feed service
├─ notification-service/    # Notification service
├─ conversation-service/    # Chat/conversation service
└─ movie-rating-frontend/   # React frontend
```

---

## ⚙️ Technologies Used

* **Backend:** Spring Boot 4, Java 25
* **Frontend:** React, WebSockets
* **Database:** PostgreSQL
* **Cache:** Redis
* **Search Engine:** Elasticsearch
* **Object Storage:** MinIO (S3-compatible)
* **Message Broker:** Apache Kafka
* **Monitoring & Logging:** Prometheus, Grafana, Kibana, Filebeat
* **Reverse Proxy:** Nginx
* **Containerization:** Docker, Docker Compose, Kubernetes (incomplete)

<img width="1193" height="787" alt="image" src="https://github.com/user-attachments/assets/e074b8df-378e-4820-844d-1d7d43d9beb6" />

---

## 🚀 Running the Project

1. Clone the repository:

```bash
git clone https://github.com/Walkername/movie-rating-service.git
cd movie-rating-service
```

2. Build and start all services using Docker Compose:

```bash
docker-compose up --build
```

3. Access services in your browser:

| Service       | URL                     | Port |
| ------------- | ----------------------- | ---- |
| Frontend      | `http://localhost`      | 80   |
| PgAdmin       | `http://localhost:5050` | 5050 |
| MinIO Web UI  | `http://localhost:9001` | 9001 |
| Kafka UI      | `http://localhost:8085` | 8085 |
| Kibana        | `http://localhost:5601` | 5601 |
| Grafana       | `http://localhost:3001` | 3001 |

---

## 🔧 Microservice Environment Variables

Each service uses environment variables to connect to other services. Examples:

* `SPRING_DATASOURCE_URL=jdbc:postgresql://postgresql:5432/moviecluster_db`
* `SPRING_KAFKA_BOOTSTRAP_SERVERS=kafka:19092`
* `SPRING_DATA_REDIS_HOST=redis-cache`
* `MINIO_URL=http://minio:9000`

---

## 🖥 Frontend

The frontend is located in `movie-rating-frontend` and is built with React.

Environment variables are set via `Dockerfile`:

```text
REACT_APP_USER_SERVICE_URL=http://localhost/api/users
REACT_APP_MOVIE_SERVICE_URL=http://localhost/api/movies
REACT_APP_RATING_SERVICE_URL=http://localhost/api/ratings
REACT_APP_FILE_SERVICE_URL=http://localhost/api/files
REACT_APP_USER_LIBRARY_URL=http://localhost/api/library
REACT_APP_FEED_SERVICE_URL=http://localhost/api/feed
REACT_APP_NOTIFICATION_SERVICE_URL=http://localhost/api/notifications
REACT_APP_CONVERSATION_SERVICE_URL=http://localhost/api/conversations
REACT_APP_NOTIFICATION_WEBSOCKET_URL=ws://localhost/ws/notifications
REACT_APP_CONVERSATION_WEBSOCKET_URL=ws://localhost/ws/conversations
```

---

## 📊 Monitoring

* **Prometheus:** metrics of all microservices
* **Grafana:** metrics visualization
* **Kibana + Filebeat:** centralized logging of Docker containers

---

## 🛠 CI/CD

To rebuild and redeploy the project:

```bash
docker-compose down
docker-compose up --build -d
```

Building, testing and deploying in [CI/CD GitHub Actions](.github/workflows/main.yml).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---
