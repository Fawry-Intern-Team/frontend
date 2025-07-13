import { Order } from "../models/Order";
export const mockOrders: Order[] = [
  {
    id: 1,
    customerId: 101,
    totalAmount: 250.75,
    status: 'PENDING',
    couponCode: 'SUMMER20',
    transactionId: 'txn_001',
    createdAt: '2025-07-01T10:15:00',
    updatedAt: '2025-07-01T10:15:00',
    orderProducts: [
      {
        id: 1,
        productId: 501,
        storeId: 301,
        quantity: 2,
      },
      {
        id: 2,
        productId: 502,
        storeId: 301,
        quantity: 1,
      },
    ],
  },
  {
    id: 2,
    customerId: 102,
    totalAmount: 100.0,
    status: 'PAID',
    couponCode: '',
    transactionId: 'txn_002',
    createdAt: '2025-07-03T14:00:00',
    updatedAt: '2025-07-03T14:00:00',
    orderProducts: [
      {
        id: 3,
        productId: 503,
        storeId: 302,
        quantity: 1,
      },
    ],
  },
  {
    id: 3,
    customerId: 103,
    totalAmount: 180.5,
    status: 'CANCELLED',
    couponCode: 'DISCOUNT10',
    transactionId: 'txn_003',
    createdAt: '2025-07-05T08:30:00',
    updatedAt: '2025-07-05T08:30:00',
    orderProducts: [
      {
        id: 4,
        productId: 504,
        storeId: 303,
        quantity: 3,
      },
    ],
  },
];
