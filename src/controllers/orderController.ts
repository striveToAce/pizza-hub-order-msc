import { Request, Response } from "express";
import Joi from "joi";
import {
  createOrderService,
  getOrderByIdService,
  getAllOrdersService,
  updateOrderStatusService,
} from "../services/orderService";
import { OrderStatus } from "../types/order";

// Define Joi schema for order validation
const orderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        menuItemId: Joi.string().uuid().required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required(),
  totalPrice: Joi.number().positive().required(),
  pizzaCount: Joi.number().integer().min(0).required(),
  sodaCount: Joi.number().integer().min(0).required(),
  estimatedCompletionTime: Joi.date().optional(),
}).custom((value, helpers) => {
  const { pizzaCount, sodaCount } = value;

  // Ensure that the total of pizzaCount and sodaCount is greater than 0
  if ((pizzaCount || 0) + (sodaCount || 0) <= 0) {
    return helpers.error(
      "Total of pizzaCount and sodaCount must be greater than 0"
    );
  }

  return value; // If valid, return the value
});

// Define the schema for status validation
const querySchema = Joi.object({
  status: Joi.string().valid("PENDING", "IN_PROGRESS", "COMPLETED").required(), // Ensure it's one of the valid statuses and is required
});

// Create a new order
export const createOrder = async (req: Request, res: Response) => {
  // Validate request body with Joi
  const { error } = orderSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const {
      items,
      totalPrice,
      pizzaCount,
      sodaCount,
      estimatedCompletionTime,
    } = req.body;
    const order = await createOrderService(
      items,
      totalPrice,
      pizzaCount,
      sodaCount,
      estimatedCompletionTime
    );
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: "Error creating order" });
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
  // Validate the request query
  const { error, value } = querySchema.validate(req.query);

  if (error) {
    // If validation fails, respond with an error
    return res.status(400).json({ error: error.details[0].message });
  }

  const orderStatus = parseOrderStatus(value.status);
  try {
    const orders = await getAllOrdersService(orderStatus);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Error fetching orders" });
  }
};

// Get order by ID
export const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const order = await getOrderByIdService(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: "Error fetching order" });
  }
};

// Update order status
const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid("PENDING", "IN_PROGRESS", "COMPLETED").required(),
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
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: "Error updating order status" });
  }
};
