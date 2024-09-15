# Use Node.js v20.16.0 as the base image
FROM node:20.16.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Copy the environment file
COPY .env .env

# Generate Prisma Client with the correct binary targets
RUN npx prisma generate --schema=./prisma/schema.prisma

# Run Prisma migrations
RUN npx prisma migrate deploy

# Run TypeScript build
RUN npm run build

# Expose port 3001
EXPOSE 3001

# Start the application
CMD ["npm", "run", "start"]
