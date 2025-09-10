# --- Stage 1: Development/Builder ---
FROM node:22.16.0-alpine AS development

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies (including devDependencies)
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build

# --- Stage 2: Production ---
FROM node:22.16.0-alpine AS production

# Set the working directory
WORKDIR /usr/src/app

# Copy dependencies only from the development stage
COPY --from=development /usr/src/app/package*.json ./
RUN npm ci --only=production

# Copy the build artifacts and configuration files from the development stage
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/.env .env

# Expose the port your NestJS app listens on
EXPOSE 3000

# Start the application in production mode
CMD ["node", "dist/main"]