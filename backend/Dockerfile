# ---------- build stage ----------
FROM node:22-alpine AS builder
WORKDIR /app

# copy package files and install only what we need to build
COPY backend/package*.json ./
RUN npm ci

# copy the TypeScript source and build it
COPY backend/tsconfig.json backend/src ./ 
RUN npx tsc --build

# ---------- runtime stage ----------
FROM node:22-alpine
WORKDIR /app

# copy the compiled JavaScript only (keeps the image tiny)
COPY --from=builder /app/build ./build
COPY backend/package*.json ./
RUN npm ci --omit=dev

EXPOSE 5000
CMD ["node", "build/server.js"]
