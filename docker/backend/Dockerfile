FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY backend/ ./

# Build the application
RUN npm run build || echo "No build script found, continuing..."

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY --from=builder /app/package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application
COPY --from=builder /app/build ./build
COPY --from=builder /app/src ./src

# Set environment variables
ENV NODE_ENV production
ENV PORT 5000

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "build/server.js"]
