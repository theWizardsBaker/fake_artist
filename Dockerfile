FROM node:18-alpine as base


#Production base
FROM base AS base-prod
WORKDIR /build
COPY package.json yarn.lock ./
RUN yarn install --production
COPY . .
COPY --from=deps /build/node_modules ./node_modules/
# build app for production with minification
RUN yarn build


#Develop base
FROM base as base-dev
WORKDIR /build
COPY package.json yarn.lock ./
RUN yarn install


#Production
FROM base-prod as prod
WORKDIR /var/www/http/app
# install simple http server for serving static content
RUN yarn global add http-server
COPY --from=base-prod /build/dist ./dist
# serve application
ENTRYPOINT ["http-server"]
CMD ["-g", "--cors", "-p ${PORT}", "dist"]


#Develop
FROM base-dev as dev
WORKDIR /var/www/http/app
COPY . .
COPY --from=base-dev /build/node_modules ./node_modules/
# Run dev server
ENTRYPOINT ["yarn"]


