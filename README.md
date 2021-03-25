# Task Management Application

Follow these steps below to make sure the application running in the correct way:

# Environment Install.

-  Makes sure you have installed `Mysql`, `Redis`, `NodeJs`, `PM2` on your local machine before stating the application
-  Otherwise, you should use Docker Container to host the application.

# Application Overview.

-  The task management application has required user login before interacting with tasks.
-  Makes sure you have registered an account via API Register follow on the Open API document.
-  The application also checking end to end encryption between clients and server.
   -  This is formula using to create Hmac Signature Key:
      `crypto.createHmac("sha512", secretKey).update(publicKey).digest("hex")`
   -  The publicKey can be anything as `Thisispublickey`
   -  Meanwhile, the privateKey will implicitly between clients and server.

# Application install instructions.

-  Run the command `npm i` to install all the application dependencies.
-  Modify `.env.example` file to `.env` and config the corresponding information into `.env` file
-  Run the command `npm run lint` to checking the coding convention is strict.
-  Run the command `npm run format` to format the Typescript code styles.
-  Run the command `npm run .` to starting development the application.
-  Run the command `npm run build` to compiler the application from TS to JS.
-  Run the command `npm run start:debug` to enable debug mode.
-  Run the command `npm run test:e2e` to performs the end to end testing.
-  After running `npm run .` the application will migration database automatically in development environment.

Run the commands below to build the application production mode:

-  Run the command `npm run build:prod` to build application in production environment.
-  Run the command `npm run stop` to stop current application running on PM2 cluster.
-  Run the command `npm run delete` to delete current application running on PM2 cluster.
-  After running `npm run build:prod` the application will migration database automatically in production environment.

Run the application in Docker Environment:

-  Make sure your local machine has been installed the Docker container.
-  Run the command `docker-compose up` to starting development the application.
-  Run the command `docker-compose down` to stop development the application.
-  Run the command `docker-compose up --build` to rebuild the application.
-  Run the command `docker-compose up -d` to build the application in the background.
   Note\*: There are some other docker command need to hand on by your self.

# The APIs document has issued via Open API.

-  Change open api `OPEN_API_USERNAME` and `OPEN_API_PASSWORD` to what ever characters in `.env` file
-  Otherwise, the credentials will set as default as shown below:
   -  Username: `task`
   -  Password: `management`
-  Landing on `http://localhost:3005/api/docs` to open the Open API docs for local environment.
-  Landing on `{url}/api/docs` to open the Open API docs for development/production environments.
-  Use the default credentials or username/password setting up in the `.env` file
   for sign in to open API.
