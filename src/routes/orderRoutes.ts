import { Router } from 'express';
import { createOrder, getOrderById, getAllOrders, updateOrderStatus, checkHealth } from '../controllers/orderController';

const router = Router();

// Place a new order
router.post('/order-now', createOrder);

// Get all orders by status
router.get('/get-orders', getAllOrders);

// Get order by ID
router.get('/order-detail/:id', getOrderById);

// Update order status
router.patch('/:id/status', updateOrderStatus);

// check health
router.get('/health', checkHealth);

export default router;
