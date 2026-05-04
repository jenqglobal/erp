# Backend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install

# Copy server code
COPY server/ ./server/

EXPOSE 3003

CMD ["npm", "start"]