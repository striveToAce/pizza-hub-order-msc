import { Router } from 'express';
import { createOrder, getOrderById, getAllOrders, updateOrderStatus } from '../controllers/orderController';

const router = Router();

// Place a new order
router.post('/order-now', createOrder);

// Get all orders by status
router.get('/', getAllOrders);

// Get order by ID
router.get('/:id', getOrderById);

// Update order status
router.patch('/:id/status', updateOrderStatus);

export default router;
