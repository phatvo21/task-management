# Instal package dependencies
FROM node:12-alpine AS dependency

# Defind the working directory
WORKDIR /task-management

# Copy the packages file to root directory in docker container
COPY package*.json ./
RUN npm ci

# Build source
FROM dependency AS base
COPY . .

# Build source
FROM base AS build
RUN npm run build

# Ship compiled sources
FROM dependency

COPY --from=build /task-management/dist ./dist

RUN npm prune --production

# Start run the application
CMD ["node", "./dist/server.js"]
