$containerName = "web"

echo "Building Docker images..."
docker-compose -f ./docker-compose.yml -f ./docker-compose.override.yml -f ./docker-compose.rider.yml build
echo "Deploying docker containers..."
docker-compose -f ./docker-compose.yml -f ./docker-compose.override.yml -f ./docker-compose.rider.yml up --wait

echo "Killing existing dotnet instances in the container..."
docker-compose exec -t $containerName killall dotnet

echo "Environment variables..."
docker-compose exec -t $containerName /usr/bin/env

echo "Building and running the application..."
docker-compose exec -t -w=/app/web $containerName dotnet -d  --no-launch-profile --no-restore --no-build /app/web/bin/Debug/net7.0/web

