import express from 'express';
import orderRoutes from './routes/orderRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Register routes
app.use('/api/orders', orderRoutes);

export default app;
