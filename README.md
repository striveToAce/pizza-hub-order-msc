
# Pizza Fusion Order Service

The **Order Service** is responsible for handling order placement, retrieval, status updates, and health check for the Pizza Fusion application.

This service is built with **Node.js**, **Express**, **TypeScript**, and **Prisma** ORM, and is containerized using Docker.

---

## Table of Contents
1. [Features](#features)
2. [API Documentation](#api-documentation)
3. [Setup Instructions](#setup-instructions)
4. [Environment Variables](#environment-variables)
5. [Kubernetes Deployment](#kubernetes-deployment)
6. [Health Check](#health-check)
7. [Contributing](#contributing)

---

## Features
- **Place Orders**: Place new orders for pizzas and sodas.
- **Get Order by ID**: Retrieve a specific order by its ID.
- **Get Orders by Status**: Fetch orders filtered by their status (e.g., `PENDING`, `IN_PROGRESS`, `COMPLETED`).
- **Update Order Status**: Update the status of an order (e.g., from `PENDING` to `IN_PROGRESS` or `COMPLETED`).
- **Health Check**: Check the health of the order service.

---

## API Documentation

### Base URL
- Local: `http://localhost:3001`
- Kubernetes ClusterIP: `http://pizza-fusion-order-service:3001`

### Endpoints

#### 1. **Place a New Order**
- **Endpoint**: `/order-now`
- **Method**: `POST`
- **Description**: Creates a new order for pizzas and sodas.
- **Request Body**:
  ```json
  {
    "items": [
      { "menuItemId": "1", "quantity": 2 },
      { "menuItemId": "2", "quantity": 1 }
    ],
    "totalPrice": 29.99,
    "pizzaCount": 2,
    "sodaCount": 1
  }
  ```
- **Response**:
  - `201 Created`: Returns the created order.
  - `400 Bad Request`: Invalid request data.

#### 2. **Get All Orders by Status**
- **Endpoint**: `/get-orders`
- **Method**: `GET`
- **Query Parameters**:
  - `status`: `PENDING`, `IN_PROGRESS`, `COMPLETED`
- **Description**: Fetches all orders by status.
- **Response**:
  - `200 OK`: Returns an array of orders.
  - `400 Bad Request`: If the status is invalid.

#### 3. **Get Order by ID**
- **Endpoint**: `/order-detail/:id`
- **Method**: `GET`
- **Description**: Retrieves a specific order by its ID.
- **Response**:
  - `200 OK`: Returns the order details.
  - `404 Not Found`: If the order is not found.

#### 4. **Update Order Status**
- **Endpoint**: `/:id/status`
- **Method**: `PATCH`
- **Description**: Updates the status of an order by its ID.
- **Request Body**:
  ```json
  {
    "status": "IN_PROGRESS"
  }
  ```
- **Response**:
  - `200 OK`: Returns the updated order.
  - `404 Not Found`: If the order is not found.

#### 5. **Health Check**
- **Endpoint**: `/health`
- **Method**: `GET`
- **Description**: Check the health status of the order service.
- **Response**:
  - `200 OK`: Health check success.

---

## Setup Instructions

### Prerequisites
- **Node.js** v20.16.0 or higher
- **npm** or **yarn**
- **Docker** (for containerization)
- **Kubernetes** (for orchestration)

### Local Development Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/pizza-fusion-order-msc.git
   cd pizza-fusion-order-msc
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` or `.env.local` file in the root directory and add the following:
   ```env
   DATABASE_URL=your_database_url
   ```
   **DOCKER IMAGE (ALREADY HAVE ENV INCLUDED)**

4. **Run Prisma migrations**:
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Access the service**:
   Open `http://localhost:3001` in your browser or API tool (Postman, Insomnia).

---

## Environment Variables

The service requires the following environment variables to function:

- **DATABASE_URL**: The connection string for the PostgreSQL database (provided by Supabase).

```bash
DATABASE_URL=your_supabase_database_url
```
**DOCKER IMAGE (ALREADY HAVE ENV INCLUDED)**

Make sure to define this in the `.env` or `.env.local` file.

---

## Kubernetes Deployment

### 1. **Deploy to Kubernetes**

First, ensure that the **Docker image** for the service is built and pushed to **Docker Hub**:

```bash
docker build -t docker.io/docker380431/pizza-fusion-order-msc .
docker push docker.io/your-username/pizza-fusion-order-msc
```

Apply the **Kubernetes** deployment and service files:

```bash
kubectl apply -f k8s/deployment.yml
kubectl apply -f k8s/service.yml
```

### 2. **Deployment File**

#### `k8s/deployment.yml`
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pizza-fusion-order
spec:
  replicas: 2
  selector:
    matchLabels:
      app: pizza-fusion-order
  template:
    metadata:
      labels:
        app: pizza-fusion-order
    spec:
      containers:
      - name: pizza-fusion-order
        image: docker.io/docker380431/pizza-fusion-order-msc:latest
        ports:
        - containerPort: 3001
```

### 3. **Service File**

#### `k8s/service.yml`
```yaml
apiVersion: v1
kind: Service
metadata:
  name: pizza-fusion-order-service
spec:
  selector:
    app: pizza-fusion-order
  ports:
    - protocol: TCP
      port: 3001
      targetPort: 3001
  type: ClusterIP
```

---

## Health Check

You can use the health check endpoint to ensure that the order service is running correctly:

```bash
curl http://localhost:3001/health
```

Expected output:
```json
{
  "message": "order service working fine"
}
```

---

## Contributing

Contributions are welcome! If you'd like to make improvements to this service, feel free to submit a PR or open an issue.

### Steps to Contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m "Add some feature"`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a Pull Request.

---
