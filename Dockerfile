FROM node:18-alpine as base

FROM base as deps
WORKDIR /build
COPY package.json yarn.lock ./
RUN yarn install

FROM base
WORKDIR /var/www/http/app
COPY . .
COPY --from=deps /build/node_modules ./node_modules/

ENTRYPOINT ["yarn"]
CMD ["build"]