# Use an official Node runtime as a parent image
FROM node:12.16.2-alpine

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app/

# Install dependencies & build
RUN yarn install --production=false && yarn build

# Launch the container
CMD ["yarn", "start:prod"]
