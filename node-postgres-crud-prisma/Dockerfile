# Use the official Node.js image
FROM node:22.18-alpine3.21

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Expose the application port
EXPOSE 3000

# Run the application
CMD ["npm", "start"]