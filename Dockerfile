# Typescript -> Javascript
FROM node:10.15 as build

RUN npm i npm@latest -g
WORKDIR /opt

ENV NODE_ENV development

COPY package.json package-lock.json ./
RUN npm install && npm cache clean --force

COPY . .
RUN ./node_modules/.bin/tsc


# Install node dependencies
FROM node:10.15 as npm

RUN npm i npm@latest -g
WORKDIR /opt

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

COPY package.json package-lock.json ./
RUN npm install && npm cache clean --force


# Application
FROM node:10.15

RUN npm i -g pm2

RUN mkdir -p /opt/app && touch /opt/app/.env
WORKDIR /opt/app

COPY --from=npm /opt/node_modules ./node_modules
COPY --from=build /opt/dist/ .

CMD ["pm2-runtime", "bin/start-app.js"]