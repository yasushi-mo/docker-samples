# Use the official Node.js image
FROM node:20-alpine3.19

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
