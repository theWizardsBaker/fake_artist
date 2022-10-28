FROM node:18-alpine as base

# RUN addgroup --gid 1001 --system app && \
#    adduser --no-create-home --shell /bin/false --disabled-password --uid 1001 --system --group app

# USER app

# COPY requirements.txt .

# RUN --mount=type=cache,target=/root/.cache/pip \
#        pip install -r requirements.txt

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