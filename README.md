# Task Management Application

# Introduction

This is a NodeJs application written in Typescript and some enhancement. By applying some design patterns and design architecture, unit test and integration test mechanism against a real database, caching mechanism with Redis, documentation with open API, Docker, CI/CD stuffs, authentication using both JWT and HMAC signature that helps this application consideration as a NodeJS (Typescript) boilerplate.

# Why task management application?

The idea of creating this application is to handle real-life requirements using a strong Node JS (Typescript) application using some design patterns, architecture, and the proper testing mechanism that helps the application's stability and scalability.

# Application's specifications

Build a task management API.

- A user is able to submit a task through an endpoint.
- The backend will consume the task (use a random timer delay to simulate some work).
- Through another endpoint, the user can check the status of the task.
- Store tasks in a database (MySQL)
- A task is first created as a draft with a 24h lifetime, it needs to be confirmed to be added to the task queue.
- Use Redis to store draft tasks
- Create an authentication procedure between the client and the server using either an HMAC signature and a shared secret OR mutual TLS

# Environment Install.

Follow these steps below to make sure the application running in the correct way:

- Makes sure you have installed `Mysql`, `Redis`, `NodeJs`, `PM2` on your local machine before stating the application
- Otherwise, you should use `Docker Container` to host the application.

# Application install instructions.

- Run the command `npm i` to install all the application dependencies.
- Modify `.env.example` file to `.env` and config the corresponding information into `.env` file
- Run the command `npm run lint` to checking the coding convention is strict.
- Run the command `npm run format` to format the Typescript code styles.
- Run the command `npm run migration:create` to create a database migration file.
- Run the command `npm run migration:run` to run all the current database migration.
- Run the command `npm run migration:revert` to revert the current database migration.
- Run the command `npm run .` to starting development the application.
- Run the command `npm run build` to compiler the application from TS to JS.
- Run the command `npm run start:debug` to enable debug mode.
- Run the command `npm run test` to performs the all the test.
- Run the command `npm run test:compose` to performs the all the test with Docker.

Run the commands below to build the application production mode:
First we need to change `NODE_ENV=production` in the `.env` file

- Run the command `npm run start` to run application on production mode.
- Run the command `npm run start:prod` to build application with PM2 cluster.
- Run the command `npm run stop` to stop current application running on PM2 cluster.
- Run the command `npm run delete` to delete current application running on PM2 cluster.
- After running `npm run start:prod` the application will migration database automatically in production environment.

Run the application in Docker Environment:

- Make sure your local machine has been installed the Docker container.
- Run the command `docker-compose up` to starting development the application.
- Run the command `docker-compose down` to stop development the application.
- Run the command `docker-compose up --build` to rebuild the application.
- Run the command `docker-compose up -d` to build the application in the background.
  Note\*: There are some other docker command need to hand on by your self.

# The APIs document has issued via Open API.

- Change open api `OPEN_API_USERNAME` and `OPEN_API_PASSWORD` to what ever characters in `.env` file
- Otherwise, the credentials will set as default as shown below:
  - Username: `task`
  - Password: `management`
- Landing on `http://localhost:3005/api/docs` to open the Open API docs for local environment.
- Landing on `{url}/api/docs` to open the Open API docs for development/production environments.
- Use the default credentials or username/password setting up in the `.env` file
  for sign in to open API.
