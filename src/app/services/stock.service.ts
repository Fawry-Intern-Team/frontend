import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stock } from '../models/stock.model';

@Injectable({
    providedIn: 'root',
})
export class StockService {
    private apiUrl = 'http://localhost:8087/api/store';

    constructor(private http: HttpClient) {}

    getStocksByStoreId(storeId: string): Observable<Stock[]> {
        return this.http.get<Stock[]>(`${this.apiUrl}/${storeId}/stock`);
    }
}