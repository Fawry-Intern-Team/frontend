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
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly baseUrl = 'http://localhost:8083/api/v1/orders';
  constructor(private http: HttpClient) { }
  createOrder(order: OrderRequest): Observable<any> {
    return this.http.post(this.baseUrl, order);
  }
}