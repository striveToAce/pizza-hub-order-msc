import express from 'express';
import orderRoutes from './routes/orderRoutes';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Register routes
app.use('/api/pizza-fusion/order', orderRoutes);

export default app;
