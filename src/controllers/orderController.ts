import { Request, Response } from 'express';
import Joi from 'joi';
import { createOrderService, getOrderByIdService, getAllOrdersService, updateOrderStatusService } from '../services/orderService';
import { OrderStatus } from '../types/order';

// Define Joi schema for order validation
const orderSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({
      menuItemId: Joi.string().uuid().required(),
      quantity: Joi.number().integer().min(1).required(),
    })
  ).min(1).required(),
  totalPrice: Joi.number().positive().required(),
});

// Create a new order
export const createOrder = async (req: Request, res: Response) => {
  // Validate request body with Joi
  const { error } = orderSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { items, totalPrice } = req.body;
    const order = await createOrderService(items, totalPrice);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error creating order' });
  }
};

const parseOrderStatus = (status: any): OrderStatus => {
  if (Object.values(OrderStatus).includes(status as OrderStatus)) {
    return status as OrderStatus;
  }
  return OrderStatus.PENDING;
};
// Get all orders by status
export const getAllOrders = async (req: Request, res: Response) => {
  const { status } = req.query;
  const orderStatus = parseOrderStatus(status);
  try {
    const orders = await getAllOrdersService(orderStatus);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
};

// Get order by ID
export const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const order = await getOrderByIdService(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching order' });
  }
};

// Update order status
const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED').required(),
});

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Validate request body with Joi
  const { error } = updateOrderStatusSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { status } = req.body;
  try {
    const updatedOrder = await updateOrderStatusService(id, status);
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Error updating order status' });
  }
};
