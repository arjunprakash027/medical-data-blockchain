#!/bin/bash -u

NO_LOCK_REQUIRED=true

. ./.env
. ./.common.sh

# create log folders with the user permissions so it won't conflict with container permissions
mkdir -p logs/besu logs/quorum logs/tessera

# Build and run containers and network
echo "docker-compose.yml" > ${LOCK_FILE}

echo "${bold}*************************************"
echo "Quorum Dev Quickstart"
echo "*************************************${normal}"
echo "Start network"
echo "--------------------"

if [ -f "docker-compose-deps.yml" ]; then
    echo "Starting dependencies..."
    docker compose -f docker-compose-deps.yml up --detach
    sleep 60
fi

echo "Starting network..."
docker compose build --pull
docker compose up --detach


#list services and endpoints
./list.sh
