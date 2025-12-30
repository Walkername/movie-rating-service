#!/bin/bash
# apply-changes.sh
echo "Applying changes and deploying all services..."
kubectl apply -k .

echo "Changes have been made"

kubectl port-forward svc/postgres-service 5432:5432 &
kubectl port-forward svc/redis-service 6379:6379 &
kubectl port-forward svc/kafka-service 9092:9092 &
kubectl port-forward svc/elasticsearch-service 9200:9200 &
kubectl port-forward svc/kibana-service 5601:5601 &
kubectl port-forward svc/minio-service 9000:9000 9001:9001 &

echo "Services have been deployed"