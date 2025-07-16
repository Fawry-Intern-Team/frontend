export interface Order {
  id: string;
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
  id: string;
  productId: number;
  storeId: number;
  quantity: number;
}
