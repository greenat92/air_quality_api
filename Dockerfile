# Use the official Node.js LTS image with Alpine as a base image
FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock and install dependencies
COPY package.json yarn.lock ./
RUN yarn install --production

# Copy application source
COPY . .

# Expose port
EXPOSE 4000

# Start the application
CMD ["yarn", "start"]
