FROM node:14.17.3-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile --production=false && yarn build

FROM node:14.17.3-alpine
WORKDIR /app
COPY package.json yarn.lock ./
COPY --from=builder /app/dist ./dist
RUN yarn install --frozen-lockfile --production
CMD ["yarn", "start:prod"]
