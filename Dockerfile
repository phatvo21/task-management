FROM node:12-alpine

RUN npm install pm2 -g

RUN mkdir -p /var/www/task-management
WORKDIR /var/www/task-management

ENV PATH /var/www/task-management/node_modules/.bin:$PATH
RUN adduser --disabled-password phatvt

ARG NODE_ENV=$NODE_ENV
ENV NODE_ENV $NODE_ENV

# Copy existing application directory contents
COPY . /var/www/task-management
COPY package.json /var/www/task-management
COPY package-lock.json /var/www/task-management

RUN chown -R phatvt:phatvt /var/www/task-management
USER phatvt

RUN npm i --no-optional && npm cache clean --force
RUN npm run build

EXPOSE 3005

CMD ["pm2-runtime", "dist/app.js"]
