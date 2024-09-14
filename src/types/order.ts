export const OrderStatus = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
  } as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];
