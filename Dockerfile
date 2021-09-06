# Instal package dependencies
FROM node:12-alpine AS dependency

WORKDIR /task-management

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

CMD ["node", "./dist/server.js"]
