#!/bin/bash

# Deployment script for Prop.ie platform
# This script handles the deployment of the Prop.ie platform to production

# Exit on error
set -e

# Configuration
DEPLOY_ENV=${1:-production}
DOCKER_COMPOSE_FILE="docker/docker-compose.yml"
FRONTEND_ENV_FILE="frontend/.env.$DEPLOY_ENV"
BACKEND_ENV_FILE="backend/.env.$DEPLOY_ENV"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print header
echo -e "${GREEN}=== Prop.ie Platform Deployment ===${NC}"
echo -e "${YELLOW}Deploying to $DEPLOY_ENV environment${NC}"

# Check if required files exist
if [ ! -f "$DOCKER_COMPOSE_FILE" ]; then
  echo -e "${RED}Error: Docker Compose file not found at $DOCKER_COMPOSE_FILE${NC}"
  exit 1
fi

if [ ! -f "$FRONTEND_ENV_FILE" ]; then
  echo -e "${RED}Error: Frontend environment file not found at $FRONTEND_ENV_FILE${NC}"
  exit 1
fi

if [ ! -f "$BACKEND_ENV_FILE" ]; then
  echo -e "${RED}Error: Backend environment file not found at $BACKEND_ENV_FILE${NC}"
  exit 1
fi

# Copy environment files
echo -e "${YELLOW}Copying environment files...${NC}"
cp "$FRONTEND_ENV_FILE" frontend/.env
cp "$BACKEND_ENV_FILE" backend/.env

# Build and start containers
echo -e "${YELLOW}Building and starting containers...${NC}"
docker-compose -f "$DOCKER_COMPOSE_FILE" build
docker-compose -f "$DOCKER_COMPOSE_FILE" up -d

# Wait for services to be ready
echo -e "${YELLOW}Waiting for services to be ready...${NC}"
sleep 10

# Check if services are running
echo -e "${YELLOW}Checking service status...${NC}"
if docker-compose -f "$DOCKER_COMPOSE_FILE" ps | grep -q "Up"; then
  echo -e "${GREEN}Services are running successfully!${NC}"
else
  echo -e "${RED}Error: Some services failed to start. Check logs with 'docker-compose logs'${NC}"
  exit 1
fi

# Display access information
echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo -e "Frontend: http://localhost:3000"
echo -e "Backend API: http://localhost:5000"
echo -e "MongoDB: mongodb://localhost:27017"
echo -e "${YELLOW}For production deployment, configure your domain and SSL certificates.${NC}"
