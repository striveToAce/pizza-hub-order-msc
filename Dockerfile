# Use Node.js v20.16.0 as the base image
FROM node:20.16.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Run TypeScript build
RUN npm run build

# Expose port 3001 (since your app is running on 3001)
EXPOSE 3001

# Command to run your app (this will use the compiled JavaScript files)
CMD ["npm", "run", "start"]
