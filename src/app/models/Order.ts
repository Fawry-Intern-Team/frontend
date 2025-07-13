export interface Order {
  id: number;
  customerId: number;
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'SHIPPED' | string;
  couponCode: string;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
  orderProducts: OrderProduct[];
}

export interface OrderProduct {
  id: number;
  productId: number;
  storeId: number;
  quantity: number;
}
