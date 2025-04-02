FROM node:20.19-bullseye AS build
RUN apt-get -y update \
  && apt-get install -y vim

ENV BUILD_DIR /usr/src

WORKDIR $BUILD_DIR

COPY .env .
COPY .yarnrc.yml .
COPY app .
COPY assets .
COPY package.json .
COPY yarn.lock .

RUN corepack enable
RUN corepack install --global yarn@4.8.1
RUN yarn set version 4.8.1
RUN yarn install

RUN chown -R node:node $BUILD_DIR/*

EXPOSE 3000
