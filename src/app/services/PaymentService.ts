
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface InitiateTransactionRequest {
  idempotencyKey: string | null;
  cardNumber: string;
  amount: number;
  transactionType: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'REFUND';
}
export interface InitiateTransactionResponse {
  transactionId: string;
}
export interface ConfirmTransactionRequest {
  transactionId: string | null;
  otp: string | null;
}
export interface ConfirmTransactionResponse {
  transactionId: string;
}
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly baseUrl = 'http://localhost:8085/api/v1/transactions';
  constructor(private http: HttpClient) { }
  initiateTransaction(request: InitiateTransactionRequest): Observable<InitiateTransactionResponse> {
    return this.http.post<InitiateTransactionResponse>(`${this.baseUrl}/initiate`, request);
  }
  confirmTransaction(request: ConfirmTransactionRequest): Observable<ConfirmTransactionResponse> {
    return this.http.post<ConfirmTransactionResponse>(`${this.baseUrl}/confirm`, request);
  }
}
