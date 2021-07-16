# FROM node:12.16.2-alpine AS builder
# WORKDIR /app
# COPY . .
# RUN yarn install --production=false && yarn build

# FROM node:12.16.2-alpine
# WORKDIR /app
# COPY package.json yarn.lock ./
# COPY --from=builder /app/dist ./dist
# RUN yarn install --production
# CMD ["yarn", "start:prod"]

FROM node:12.16.2-alpine
WORKDIR /app
COPY package.json yarn.lock ./
