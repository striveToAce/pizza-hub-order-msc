import { PrismaClient } from "@prisma/client";
import { OrderStatus } from "../types/order";

const prisma = new PrismaClient();

interface CreateOrderItem {
  menuItemId: string;
  quantity: number;
}
// Create a new order
export const createOrderService = async (
  items: CreateOrderItem[],
  totalPrice: number,
  pizzaCount: number,
  sodaCount: number,
  estimatedCompletionTime: number,
  status:OrderStatus
) => {
  const order = await prisma.order.create({
    data: {
      status, // Enum type status
      totalPrice,
      pizzaCount,
      sodaCount,
      estimatedCompletionTime,
      items: {
        create: items.map((item) => ({
          quantity: item.quantity,
          menuItemId: item.menuItemId,
        })),
      },
    },
    include: { items: true }, // Include the related order items in the result
  });

  return order;
};
// Get all orders by status
export const getAllOrdersService = async (status?: OrderStatus) => {
  const whereCondition = status ? { status } : {};
  const orders = await prisma.order.findMany({
    where: whereCondition,
    include: { items: { include: { menuItem: true } } },
  });
  return orders;
};

// Get order by ID
export const getOrderByIdService = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { menuItem: true } } },
  });
  return order;
};

// Update order status
export const updateOrderStatusService = async (
  id: string,
  status: OrderStatus
) => {
  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status },
    include: { items: { include: { menuItem: true } } },
  });
  return updatedOrder;
};
