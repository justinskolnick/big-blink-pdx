FROM node:22.19-bookworm AS build
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
RUN corepack install --global yarn@4.10.3
RUN yarn set version 4.10.3
RUN yarn install

RUN chown -R node:node $BUILD_DIR/*

EXPOSE 3000
