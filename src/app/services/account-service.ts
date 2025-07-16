import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account, AccountLogin } from '../models/Account';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private http: HttpClient) {

  }
  private baseUrl = 'http://localhost:8085/api/v1/accounts';
  private LogedInUser: Account | null = null;
  login(loginData: AccountLogin): Observable<Account> {
    return this.http.post<Account>(`${this.baseUrl}/login`, loginData);
  }
  setLoggedInUser(user: Account) {
    this.LogedInUser = user;
  }
  getLoggedInUser(): Account | null {
    return this.LogedInUser;
  }
  getAllAccounts(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }
  getTransactionsByCardNumber(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}/transactions`);
  }
  createAccount(account: Account): Observable<Account> {
    return this.http.post<Account>(this.baseUrl, account);
  }

  updateAccount(cardNumber: string, account: Account): Observable<Account> {
    return this.http.put<Account>(`${this.baseUrl}/${cardNumber}`, account);
  }

  getAccount(id: string): Observable<Account> {
    return this.http.get<Account>(`${this.baseUrl}/${id}`);
  }

}
