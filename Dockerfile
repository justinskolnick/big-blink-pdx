# syntax=docker/dockerfile:1

FROM node:18-bullseye

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
CMD [ "node", "server.js" ]
