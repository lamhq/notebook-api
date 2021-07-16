FROM node:12.16.2-alpine
WORKDIR /app
COPY package.json yarn.lock /app
CMD ["yarn", "start:prod"]