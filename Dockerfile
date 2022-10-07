FROM node:lts
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
