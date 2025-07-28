// services/order.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface OrderProduct {
  productId: string;
  storeId: string;
  quantity: number;
}

export interface OrderRequest {
  idempotencyKey: string | null;
  customerId: string;
  totalAmount: number;
  couponCode?: string;
  orderProducts: OrderProduct[];
}
export interface OrderResponse {
  id: string; 
  customerId: string;
  totalAmount: number; 
  couponCode: string | null; 
  transactionId: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELED'; 
  createdAt: string; 
  orderProducts: OrderProduct[];
}
export interface OrderStatusUpdateRequest {
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELED';
  transactionId?: string | null;
}
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly baseUrl = 'http://localhost:8083/api/v1/orders';
  constructor(private http: HttpClient) { }
  createOrder(order: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.baseUrl, order);
  }
  getOrderById(orderId: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.baseUrl}/${orderId}`);
  }
  updateOrderStatus(orderId: string, statusUpdate: OrderStatusUpdateRequest): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(`${this.baseUrl}/${orderId}/status`, statusUpdate);
  }
}