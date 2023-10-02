# Node 18 LTS - secure, minimal base image
FROM node:18-alpine as dev

# Set working dir
WORKDIR /usr/src/app

# Only copying package*.json files before install.
# If package*.json files do not change then dependancies will not need
# to be reinstalled.
COPY package*.json ./

# Install dependencies
# Using `npm ci` for a more reliable dependency installation
RUN npm ci --only=production

# Copy the dist directory and other necessary files
COPY dist ./dist

# Expose the port the app runs on
EXPOSE 8080

# Start the app in production mode
CMD [ "node", "dist/main" ]