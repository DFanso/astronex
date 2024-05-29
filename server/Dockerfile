# Use the official Node.js image as a base image
FROM node:20-alpine

# Create and change to the app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN yarn install

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN yarn build

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["yarn", "start:prod"]
