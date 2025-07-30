// services/order.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
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
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELED' | 'DELIVERED';
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
  private readonly baseUrl = 'http://localhost:8080/api/v1/orders';
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
  getAllOrders(size: number, page: number, status: string | null, customerId: string): Observable<any> {
    let params = new HttpParams()
      .set('size', size.toString())
      .set('page', page.toString());

    if (status) params = params.set('status', status);

    if (this.isValidUUID(customerId)) { 
      params = params.set('customerId', customerId);
    }
    return this.http.get(this.baseUrl, { params });
  }

  isValidUUID(value: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

}